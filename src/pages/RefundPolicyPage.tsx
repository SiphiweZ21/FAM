import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'

const configuredEmail = String(import.meta.env.VITE_SUPPORT_EMAIL || 'support@futureafricaminds.com').trim()
const supportEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuredEmail) ? configuredEmail : ''

export default function RefundPolicyPage() {
  useEffect(() => {
    const previous = document.title
    document.title = 'Refund and cancellation policy | FutureAfricaMinds'
    return () => { document.title = previous }
  }, [])
  return <article className="refund-policy">
    <header className="refund-policy-header">
      <span className="eyebrow">FAM CUSTOMER CARE</span>
      <h1>Refund and cancellation policy</h1>
      <p>Clear terms for your once-off Premium purchase.</p>
      <small>Last updated: 7 October 2026 · Applies to FAM digital Premium passes</small>
    </header>
    <div className="refund-policy-summary"><ShieldCheck size={28} aria-hidden="true" /><div><strong>One payment. No automatic renewal.</strong><p>Request a full refund within seven calendar days of purchase. Your consumer rights remain protected.</p></div></div>
    <section><h2>1. What you are purchasing</h2><p>FutureAfricaMinds (FAM) provides digital learning access. A Monthly Pass costs R110 for 30 days. A Term Pass costs R200 for three months. Access starts after successful payment verification; your account shows its expiry date. Each purchase is a once-off payment and is linked to your account.</p><p>This policy covers digital Premium passes. It does not cover physical stationery, books or other shop orders.</p></section>
    <section><h2>2. Cancelling your access</h2><p>There is no recurring subscription or automatic debit to cancel. Your pass expires at the end of the purchased period unless you choose to buy another pass. You can stop using FAM at any time.</p><p>Stopping use or deleting your account does not automatically submit a refund request. Contact us if you want a refund, preferably before deleting your account so we can identify the purchase.</p></section>
    <section><h2>3. Seven-day refund period</h2><p>If you change your mind, contact us within seven calendar days of purchase to request a full refund. FAM offers this seven-day refund period even if you have started using Premium. There is no cancellation fee.</p><p>After seven days, change-of-mind refunds are reviewed individually and are not automatically guaranteed. This does not limit any refund or other remedy you are entitled to under South African law.</p></section>
    <section><h2>4. Duplicate charges and access problems</h2><p>If the same purchase was charged twice in error, we will refund the verified duplicate charge. If you paid but Premium did not activate, send us your payment reference so we can investigate and restore access or refund the affected payment.</p><p>If FAM fails to deliver the paid service or there is a material service problem, you may request that we resolve it or provide an appropriate full or partial refund, taking account of the problem and your legal rights. You do not have to accept account credit instead of a refund you are entitled to receive.</p><p>If a checkout failed or was cancelled but your bank shows a pending amount, contact us before paying again. A pending authorisation may be released by your bank rather than refunded as a completed payment.</p></section>
    <section id="request"><h2>5. How to request a refund</h2><p>The purchaser, or a parent or guardian acting for a learner, should send a request with the subject <strong>FAM refund request</strong> and include:</p><ul><li>The email used for your FAM account.</li><li>Your payment reference, purchase date and amount.</li><li>The pass purchased and a short explanation, if there was a payment or access problem.</li></ul><p>You do not need to give a reason for a request made within the seven-day refund period. Never send your password, PIN, OTP, full card number or banking login details.</p>
    {supportEmail ? <p><a className="button primary" href={`mailto:${supportEmail}?subject=FAM%20refund%20request`}>Email your refund request</a><br /><a href={`mailto:${supportEmail}`}>{supportEmail}</a></p> : <p className="refund-contact-pending" role="status">Our refund contact address is being configured. It must be available here before paid checkout launches.</p>}
    </section>
    <section><h2>6. Processing your refund</h2><p>We aim to acknowledge requests within two business days and provide an outcome within five business days. If further information is required, we will explain what is needed and keep you updated.</p><p>Approved refunds are returned through the original payment provider to the original payment method where supported. Your provider or bank determines when the credit appears; we will share the refund confirmation or reference. Where a statutory cooling-off refund applies, it will be made within 30 days of cancellation.</p><p>A full refund ends access supplied by the refunded pass once the refund is confirmed. Your free account remains available. Other valid passes are not affected. Partial refunds and any related access adjustment will be explained to you.</p></section>
    <section><h2>7. Your rights and policy changes</h2><p>This policy does not exclude or limit rights under the Consumer Protection Act or the Electronic Communications and Transactions Act where they apply. If a legal requirement gives you greater protection, that requirement takes precedence.</p><p>You may raise an unresolved complaint with the relevant consumer protection authority, including the National Consumer Commission, or use your bank's dispute process. Contacting FAM first does not remove those rights.</p><p>We may update this policy for future purchases. The terms applicable when you purchased continue to apply to that purchase, subject to the law.</p></section>
    <Link className="button secondary" to="/account">Back to your account</Link>
  </article>
}
