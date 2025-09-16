const EMAIL_API_BASE = 'https://script.google.com/macros/s/AKfycbzUXA3hswDOAbXyPyOf00gYEP_9nswtXYP3Zg4U4GOfaVai-th9yr3rmfatUwNSqiJnYQ/exec';

export async function sendProvisionalPassword(email: string, userName: string, password: string) {
  try {
    const url = new URL(EMAIL_API_BASE);
    url.searchParams.append('tipo', 'senha');
    url.searchParams.append('email', email);
    url.searchParams.append('user', userName);
    url.searchParams.append('senhaprovisoria', password);

    const response = await fetch(url.toString());
    return response.ok;
  } catch (error) {
    console.error('Error sending provisional password email:', error);
    return false;
  }
}

export async function sendWelcomeEmail(email: string, userName: string) {
  try {
    const url = new URL(EMAIL_API_BASE);
    url.searchParams.append('tipo', 'bemvindo');
    url.searchParams.append('email', email);
    url.searchParams.append('user', userName);

    const response = await fetch(url.toString());
    return response.ok;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

export async function sendPasswordRecovery(email: string, userName: string) {
  try {
    const url = new URL(EMAIL_API_BASE);
    url.searchParams.append('tipo', 'recuperar');
    url.searchParams.append('email', email);
    url.searchParams.append('user', userName);

    const response = await fetch(url.toString());
    return response.ok;
  } catch (error) {
    console.error('Error sending password recovery email:', error);
    return false;
  }
}

export function generateProvisionalPassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}