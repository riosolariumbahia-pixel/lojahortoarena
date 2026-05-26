import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '../types/database';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null,
  });

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error && error.code !== 'PGRST116') {
        console.warn('Profile fetch error:', error.message);
        return null;
      }
      return data as Profile | null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setState({ user: session.user, profile, session, loading: false, error: null });
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchProfile(session.user.id);
          setState({ user: session.user, profile, session, loading: false, error: null });
        } else if (event === 'SIGNED_OUT') {
          setState({ user: null, profile: null, session: null, loading: false, error: null });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        const profile = await fetchProfile(data.user.id);
        setState({ user: data.user, profile, session: data.session, loading: false, error: null });
        return { success: true, profile };
      }
      throw new Error('Login falhou');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login';
      let translated = message;
      if (message.includes('Invalid login credentials')) translated = 'Email ou senha incorretos.';
      if (message.includes('Email not confirmed')) translated = 'Confirme seu email antes de fazer login.';
      setState(prev => ({ ...prev, loading: false, error: translated }));
      return { success: false, error: translated };
    }
  };

  // ==========================================
  // REGISTER — Corrigido para Supabase real
  // O profile é criado por TRIGGER no banco
  // Só precisamos chamar auth.signUp
  // ==========================================
  const register = async (
    email: string,
    password: string,
    name: string,
    role: 'lojista' | 'cliente',
    _tenantId?: string
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Gerar slug pro tenant (se lojista)
      const slug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .substring(0, 40);

      // 1. Criar usuário no Supabase Auth
      //    O TRIGGER handle_new_user vai criar profile + tenant automaticamente
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            tenant_name: role === 'lojista' ? name : null,
            tenant_slug: role === 'lojista' ? `${slug}-${Date.now().toString(36)}` : null,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Verificar se o usuário foi criado
      // Supabase retorna user mesmo com confirmação de email pendente
      if (!authData.user) {
        throw new Error('Falha ao criar conta. Tente novamente.');
      }

      // Verificar se é um usuário duplicado (identities vazio)
      if (authData.user.identities && authData.user.identities.length === 0) {
        throw new Error('Este email já está cadastrado. Tente fazer login.');
      }

      // Se tem sessão = email confirmation desabilitado = login direto
      if (authData.session) {
        const profile = await fetchProfile(authData.user.id);
        setState({
          user: authData.user,
          profile,
          session: authData.session,
          loading: false,
          error: null,
        });
        return { success: true, user: authData.user, needsConfirmation: false };
      }

      // Se NÃO tem sessão = email confirmation habilitado
      // Usuário foi criado, mas precisa confirmar email
      setState(prev => ({ ...prev, loading: false }));
      return { success: true, user: authData.user, needsConfirmation: true };

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao registrar';
      let translated = message;
      if (message.includes('User already registered')) translated = 'Este email já está cadastrado. Tente fazer login.';
      if (message.includes('Password should be at least')) translated = 'A senha deve ter no mínimo 6 caracteres.';
      if (message.includes('Unable to validate email')) translated = 'Email inválido.';
      if (message.includes('Signups not allowed')) translated = 'Cadastro desabilitado. Habilite em Authentication > Settings.';
      setState(prev => ({ ...prev, loading: false, error: translated }));
      return { success: false, error: translated };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setState({ user: null, profile: null, session: null, loading: false, error: null });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!state.user) return { success: false, error: 'Não autenticado' };
    try {
      const { error } = await (supabase
        .from('profiles') as any)
        .update(updates)
        .eq('id', state.user.id);
      if (error) throw error;
      setState(prev => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...updates } : null,
      }));
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Erro' };
    }
  };

  return {
    ...state,
    isAuthenticated: !!state.user,
    isSupabaseConfigured,
    login,
    register,
    logout,
    updateProfile,
  };
}
