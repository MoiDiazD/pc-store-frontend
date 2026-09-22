import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { authApi } from '../services/auth-api'
import { userMessage } from '../services/api-client'
export function AccessPage() {
 const { user, setUser } = useAuth(); const navigate = useNavigate(); const [register, setRegister] = useState(false); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
 if (user) return <section className="page-state"><h1>Ya has accedido.</h1><Link className="button button-primary" to="/cuenta">Ir a mi cuenta</Link></section>
 async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); const email = String(data.get('email')); const password = String(data.get('password')); const name = String(data.get('name')); if (register && (name.length < 2 || password.length < 8)) { setError('El nombre debe tener al menos 2 caracteres y la contraseña 8.'); return }; setBusy(true); setError(''); try { if (register) await authApi.register({ name, email, password }); setUser(await authApi.login({ email, password })); navigate('/cuenta') } catch (err) { setError(userMessage(err)) } finally { setBusy(false) } }
 return <section className="form-page"><p className="eyebrow">Tu cuenta</p><h1>{register ? 'Crea tu cuenta.' : 'Bienvenido de nuevo.'}</h1><form onSubmit={submit} className="form-card">{register && <label>Nombre<input name="name" required minLength={2} maxLength={200} /></label>}<label>Email<input name="email" type="email" required maxLength={200} /></label><label>Contraseña<input name="password" type="password" required minLength={register ? 8 : 1} maxLength={128} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary" disabled={busy}>{busy ? 'Enviando…' : register ? 'Crear cuenta' : 'Acceder'}</button></form><button className="plain-button" onClick={() => { setRegister(!register); setError('') }}>{register ? '¿Ya tienes cuenta? Accede' : '¿No tienes cuenta? Créala'}</button></section>
}
