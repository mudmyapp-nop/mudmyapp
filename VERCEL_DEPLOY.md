# Mudmy Web - Vercel Deployment

เว็บไซต์ Mudmy ใช้ Next.js และ Supabase จึงสามารถ deploy บน Vercel ได้โดยไม่ต้องสร้าง `vercel.json` เพิ่ม

## 1. เตรียมโปรเจกต์

ตรวจสอบ Node.js 20 ขึ้นไป แล้วติดตั้ง dependencies:

```bash
pnpm install
pnpm build
```

ก่อนเปิด Production ควรแก้ TypeScript errors ให้หมด และไม่ควรใช้ `typescript.ignoreBuildErrors: true` ใน `next.config.mjs`

## 2. Deploy ผ่าน Vercel Dashboard

1. Push โปรเจกต์ขึ้น GitHub
2. เปิด [vercel.com](https://vercel.com) แล้วเลือก **Add New Project**
3. Import repository ของ Mudmy
4. ให้ Vercel ตรวจจับ Framework เป็น **Next.js**
5. ตั้งค่า Environment Variables ใน Production:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_NAME=Mudmy
NEXT_PUBLIC_APP_URL=https://www.mudmy.app
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

ตั้ง Stripe webhook ไปที่ `https://www.mudmy.app/api/payments/webhook` โดยเลือก event `checkout.session.completed` และรัน migration `supabase/migrations/20260906_add_stripe_payments.sql` ใน Supabase ก่อนเปิดใช้งานจริง

6. กด **Deploy**

## 3. Deploy ผ่านคำสั่ง

```bash
pnpm run deploy:vercel
```

ครั้งแรกระบบจะให้ login และเลือก Vercel project จากนั้นใช้คำสั่งเดิมเพื่อ deploy production ครั้งต่อไป

## 4. เพิ่มโดเมน `mudmy.app`

1. เปิด Vercel Project `mudmyapp` > **Settings > Domains**
2. เพิ่ม `mudmy.app` และ `www.mudmy.app` หากต้องการให้รองรับทั้งสองแบบ
3. ที่ Hostinger DNS ให้ใส่ค่าตามที่ Vercel แสดง โดยทั่วไปคือ:
	- ลบ `A` record เดิมของ `@` ที่ชี้ไป `2.57.91.91`
	- เพิ่ม `A` record ชื่อ `@` ชี้ไป `216.198.79.1`
	- เพิ่ม `A` record ชื่อ `@` ชี้ไป `64.29.17.1`
	- หากเพิ่ม `www` ให้ตั้ง `CNAME` ชื่อ `www` ชี้ไป `cname.vercel-dns.com`
4. ตั้งให้ `www.mudmy.app` เป็นโดเมนหลัก แล้วรอ DNS/SSL ทำงาน
5. ตรวจสอบว่า `https://www.mudmy.app` เปิดได้ก่อน redeploy

## 5. หลัง Deploy

- ตั้งค่า domain ใน Vercel Project Settings > Domains
- ตั้ง `NEXT_PUBLIC_APP_URL=https://www.mudmy.app` ใน Vercel Production แล้ว redeploy
- เพิ่ม URL ของเว็บไซต์ใน Supabase Authentication > URL Configuration
- เพิ่ม `https://www.mudmy.app/auth/callback` ใน Supabase Redirect URLs
- ตั้ง Site URL ของ Supabase เป็น `https://www.mudmy.app`
- เปิด Supabase backups และติดตาม Database/Storage usage
- ทดสอบ login, แผนที่, สร้างหมุด, รูปภาพ, chat และ API routes บน production

## หมายเหตุ

Vercel จะ deploy อัตโนมัติเมื่อ push ไปยัง branch ที่กำหนด โดย production ควรใช้ Supabase project แยกจาก development และไม่ commit ไฟล์ `.env` ที่มีค่าจริง
