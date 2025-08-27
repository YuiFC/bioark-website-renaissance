import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type AuthUser = { email:string; name?:string; role?:string } | null;
const getUsers = () => { try { return JSON.parse(localStorage.getItem('bioark_users')||'[]'); } catch { return []; } };
const setUsers = (list:any[]) => localStorage.setItem('bioark_users', JSON.stringify(list));

export default function Dashboard(){
  const [auth, setAuth] = useState<AuthUser>(() => { try { return JSON.parse(localStorage.getItem('bioark_auth_user')||'null'); } catch { return null; } });
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(()=>{
    if(!auth) return;
    const u = getUsers().find((x:any)=>x.email?.toLowerCase()===auth.email?.toLowerCase());
    if (u){ setName(u.name||''); setAddress(u.address||''); }
  },[auth]);

  const save = () => {
    if(!auth) return;
    const list = getUsers();
    const idx = list.findIndex((x:any)=>x.email?.toLowerCase()===auth.email?.toLowerCase());
    if (idx>=0){ list[idx] = { ...list[idx], name, address }; setUsers(list); }
    localStorage.setItem('bioark_auth_user', JSON.stringify({ ...auth, name }));
    alert('Saved');
  };

  if (!auth){
    return (
      <Layout>
        <div className="max-w-3xl mx-auto py-16 px-4">
          <Card>
            <CardHeader><CardTitle>Please sign in</CardTitle></CardHeader>
            <CardContent>
              <a className="text-primary underline" href="/auth.html">Go to Sign in</a>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-16 px-4 space-y-6">
        <h1 className="text-3xl font-bold">My Account</h1>
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3">
              <input className="border rounded-md px-3 py-2" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
              <input className="border rounded-md px-3 py-2" value={auth.email} disabled />
              <textarea className="border rounded-md px-3 py-2" placeholder="Shipping Address" value={address} onChange={e=>setAddress(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <Button onClick={save}>Save</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
