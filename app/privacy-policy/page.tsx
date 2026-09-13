import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Lock, UserCheck, EyeOff, Server, Trash2, Mail, CheckCircle2, FileText } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/40 via-background to-background px-4 py-8 sm:px-6 lg:px-10">
      <article className="mx-auto max-w-4xl rounded-3xl border border-border/80 bg-card p-6 shadow-xl sm:p-10">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between border-b border-border/60 pb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors">
            <ArrowLeft className="h-4 w-4" /> กลับหน้าหลัก
          </Link>
          <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
            อัปเดตล่าสุด: 13 กันยายน 2569
          </span>
        </div>

        {/* Page Header */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 border-b border-border/60 pb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white shrink-0">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              นโยบายความเป็นส่วนตัว (Privacy Policy)
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              แพลตฟอร์มหมุดหมาย (Mudmy) ให้ความสำคัญสูงสุดกับการปกป้องข้อมูลและความเป็นส่วนตัวของคุณ
            </p>
          </div>
        </div>

        {/* Highlight Callout Box: High Security & Privacy-First */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-orange-700 font-bold text-base">
            <EyeOff className="h-5 w-5 text-orange-600 shrink-0" />
            <span>นโยบายคุ้มครองความเป็นส่วนตัวขั้นสูงสุด (Privacy-First Policy)</span>
          </div>
          <p className="text-xs sm:text-sm text-orange-950/90 leading-relaxed font-medium">
            เพื่อความปลอดภัยสูงสุดและป้องกันการนำข้อมูลไปใช้ในทางที่ผิดจากผู้ไม่ประสงค์ดี 
            <strong className="text-orange-900 font-bold"> ผู้ใช้งานไม่จำเป็นต้องระบุชื่อจริง นามสกุลจริง หมายเลขโทรศัพท์ส่วนตัว หรือข้อมูลที่มีความไว้วางใจสูง (Sensitive Data) ใดๆ ทั้งสิ้น</strong> ในการใช้งานแพลตฟอร์ม 
            เราจัดเก็บเฉพาะข้อมูลเท่าที่จำเป็นต่อการให้บริการเท่านั้น
          </p>
        </div>

        {/* Content Sections */}
        <div className="mt-8 space-y-8 text-sm leading-7 text-foreground/90">

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground border-l-4 border-orange-500 pl-3">
              <FileText className="h-5 w-5 text-orange-500" />
              1. เจตนารมณ์และการเก็บข้อมูลที่จำเป็น
            </h2>
            <p className="text-muted-foreground">
              หมุดหมายเป็นแพลตฟอร์มตลาดชุมชนบนแผนที่ เราจัดเก็บเฉพาะข้อมูลที่จำเป็นต่อการแสดงผลและติดต่อบริการ ได้แก่:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <li className="flex items-start gap-2.5 bg-muted/40 p-3 rounded-xl border border-border/40">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-1 shrink-0" />
                <span><strong>ข้อมูลบัญชีผู้ใช้:</strong> อีเมลที่ใช้สมัครบริการสำหรับเข้าสู่ระบบ</span>
              </li>
              <li className="flex items-start gap-2.5 bg-muted/40 p-3 rounded-xl border border-border/40">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-1 shrink-0" />
                <span><strong>ข้อมูลหมุดหมาย:</strong> ชื่อหมุด/ร้านค้า พิกัดสถานที่ รายละเอียดสินค้า และรูปภาพประกอบ</span>
              </li>
              <li className="flex items-start gap-2.5 bg-muted/40 p-3 rounded-xl border border-border/40">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-1 shrink-0" />
                <span><strong>ช่องทางติดต่อที่คุณเลือกเปิดเผย:</strong> เช่น Line ID, ช่องทางโซเชียล หรือเบอร์ติดต่อร้านค้าที่คุณสมัครใจกรอกเอง</span>
              </li>
              <li className="flex items-start gap-2.5 bg-muted/40 p-3 rounded-xl border border-border/40">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-1 shrink-0" />
                <span><strong>ข้อความการสนทนา:</strong> ประวัติการส่งข้อความสอบถามในระบบเพื่อความสะดวกในการสื่อสาร</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground border-l-4 border-orange-500 pl-3">
              <UserCheck className="h-5 w-5 text-orange-500" />
              2. สิ่งที่เรา "ไม่จัดเก็บ" (Non-Collected Data)
            </h2>
            <p className="text-muted-foreground">
              เพื่อความอุ่นใจในการใช้งานและลดความเสี่ยงด้านความปลอดภัยของข้อมูลส่วนบุคคล เราไม่มีนโยบายบังคับเก็บข้อมูลดังต่อไปนี้:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-red-50/50 border border-red-100 text-xs leading-relaxed">
                <strong className="text-red-700 block mb-1">❌ ไม่เก็บชื่อ-นามสกุลจริง</strong>
                คุณสามารถใช้ชื่อสมมติ ชื่อร้านค้า หรือฉายาในการใช้งานได้ทันที
              </div>
              <div className="p-3.5 rounded-2xl bg-red-50/50 border border-red-100 text-xs leading-relaxed">
                <strong className="text-red-700 block mb-1">❌ ไม่เก็บเลขบัตรประชาชน</strong>
                ไม่มีการเรียกร้องเอกสารระบุตัวตนทางราชการ หรือข้อมูล Sensitive ใดๆ
              </div>
              <div className="p-3.5 rounded-2xl bg-red-50/50 border border-red-100 text-xs leading-relaxed">
                <strong className="text-red-700 block mb-1">❌ ไม่เก็บข้อมูลบัตรเครดิต</strong>
                การชำระเงินทั้งหมดดำเนินการผ่านผู้ให้บริการเกตเวย์มาตรฐานระดับสากลโดยตรง
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground border-l-4 border-orange-500 pl-3">
              <Server className="h-5 w-5 text-orange-500" />
              3. มาตรฐานระบบจัดเก็บข้อมูลที่ปลอดภัย
            </h2>
            <p className="text-muted-foreground">
              ข้อมูลทั้งหมดของแพลตฟอร์มถูกจัดเก็บและประมวลผลผ่าน <strong>ระบบจัดเก็บข้อมูลที่มีมาตรฐานความปลอดภัยสูง (Secure Data Storage Infrastructure)</strong> ซึ่งใช้มาตรการปกป้องข้อมูลระดับสากล ได้แก่:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
              <li>การเข้ารหัสข้อมูลขณะส่งผ่านเครือข่าย (Encryption in Transit - SSL/TLS)</li>
              <li>ระบบจำกัดสิทธิ์เข้าถึงข้อมูลแบบจำเพาะบุคคล (Row Level Security & Access Control)</li>
              <li>ระบบป้องกันและตรวจสอบการบุกรุกเพื่อความปลอดภัยของข้อมูลผู้ใช้ตลอด 24 ชั่วโมง</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground border-l-4 border-orange-500 pl-3">
              <Lock className="h-5 w-5 text-orange-500" />
              4. การไม่เปิดเผยข้อมูลแก่บุคคลภายนอก
            </h2>
            <p className="text-muted-foreground">
              หมุดหมายมีนโยบายเด็ดขาดว่า <strong>"จะไม่ขาย แลกเปลี่ยน หรือส่งต่อข้อมูลส่วนบุคคลของคุณให้แก่บุคคลภายนอก"</strong> เพื่อประโยชน์ทางการค้าโดยไม่ได้รับการยินยอม ยกเว้นกรณีปฏิบัติตามคำสั่งของเจ้าหน้าที่ตามกฎหมายเท่านั้น
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground border-l-4 border-orange-500 pl-3">
              <Trash2 className="h-5 w-5 text-orange-500" />
              5. สิทธิและการจัดการข้อมูลของคุณ
            </h2>
            <p className="text-muted-foreground">
              คุณเป็นเจ้าของข้อมูลอย่างสมบูรณ์ และมีสิทธิดำเนินการดังนี้ได้ทุกเมื่อ:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
              <li>แก้ไข ปรับปรุง หรือซ่อนข้อมูลหมุดหมายและรูปภาพของคุณผ่านหน้าแดชบอร์ดได้ตลอดเวลา</li>
              <li>ลบหมุดหมายที่ปักไว้ หรือขอลบบัญชีผู้ใช้และข้อมูลทั้งหมดออกจากระบบได้ตามต้องการ</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 border-t border-border/60 pt-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Mail className="h-5 w-5 text-orange-500" />
              6. การติดต่อทีมงาน
            </h2>
            <p className="text-muted-foreground">
              หากมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว หรือต้องการขอใช้สิทธิเกี่ยวกับข้อมูล สามารถติดต่อทีมงานหมุดหมายได้ทางอีเมล: <a href="mailto:mudmy.app@gmail.com" className="text-orange-600 font-bold hover:underline">mudmy.app@gmail.com</a>
            </p>
          </section>

        </div>
      </article>
    </main>
  )
}
