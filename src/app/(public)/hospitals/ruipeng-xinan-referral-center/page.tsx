import type { Metadata } from "next";
import Image from "next/image";
import {
  type HospitalImage,
  ruipengXinanReferralCenter as hospital,
} from "@/data/hospitals/ruipeng-xinan-referral-center";
import { hasPublicImage } from "@/lib/hospital-images";
import { isConfirmedPublicValue, toAbsoluteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: hospital.seo.title,
  description: hospital.seo.description,
  keywords: [...hospital.seo.keywords],
  alternates: {
    canonical: toAbsoluteUrl(hospital.seo.canonicalPath),
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: toAbsoluteUrl(hospital.seo.canonicalPath),
    siteName: hospital.name,
    title: hospital.seo.title,
    description: hospital.seo.description,
    images: [
      {
        url: toAbsoluteUrl(hospital.seo.ogImage),
        alt: hospital.images[0].alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: hospital.seo.title,
    description: hospital.seo.description,
    images: [toAbsoluteUrl(hospital.seo.ogImage)],
  },
  robots: {
    index: !hospital.seo.noIndex,
    follow: !hospital.seo.noIndex,
  },
};

export default function RuipengXinanReferralCenterPage() {
  const images = hospital.images.map((image) => ({
    ...image,
    available: hasPublicImage(image.src),
  }));
  const heroImage = images.find((image) => image.type === "hero");
  const hospitalInfo = [
    { label: "地址", value: hospital.address },
    { label: "电话", value: hospital.phone },
    { label: "营业时间", value: hospital.openingHours },
    { label: "地图", value: hospital.mapUrl, id: "map" },
  ];
  const structuredData = buildStructuredData();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {structuredData.map((item) => (
        <script
          key={item["@type"].toString()}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeStructuredData(item) }}
        />
      ))}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Image src="/ruipeng-logo.png" width={150} height={52} alt="瑞鹏宠物医院" className="h-auto w-32 sm:w-36" priority />
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <p className="hidden text-sm font-bold text-slate-600 sm:block">{hospital.shortName}</p>
          </div>
          <a href="#contact" className="rounded-md border border-ruipeng-blue px-4 py-2 text-sm font-black text-ruipeng-blue">
            就诊信息
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-blue-100 bg-white">
          <div className="absolute inset-y-0 right-0 hidden w-2/5 bg-gradient-to-br from-blue-50 to-cyan-50 lg:block" />
          <div className="absolute -right-24 top-16 hidden size-80 rounded-full border-[52px] border-white/70 lg:block" />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.25fr_0.75fr] lg:py-24">
            <div>
              <p className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-ruipeng-blue">{hospital.city} · {hospital.positioning}</p>
              <p className="mb-3 text-base font-black text-slate-600">{hospital.name}</p>
              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                {hospital.heroTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-slate-600 sm:text-lg">{hospital.heroDescription}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ActionLink href={hospital.consultationUrl} primary>电话咨询</ActionLink>
                <ActionLink href={hospital.navigationUrl}>导航到店</ActionLink>
                <ActionLink href={hospital.consultationUrl}>在线咨询</ActionLink>
              </div>
            </div>

            {heroImage ? <HospitalImageFrame image={heroImage} hero /> : null}
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <SectionHeading eyebrow="Hospital Information" title="医院基础信息" description="以下信息将在医院确认后持续补充更新。" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {hospitalInfo.map((item) => <InfoTile key={item.label} label={item.label} value={item.value} id={item.id} />)}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
            <SectionHeading eyebrow="Clinical Focus" title="重点诊疗方向" description="围绕犬猫常见疾病、进一步检查与转诊需求提供诊疗支持。" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hospital.specialties.map((item, index) => (
                <article key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <span className="text-xs font-black text-ruipeng-blue">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-5 text-lg font-black text-slate-950">{item}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">具体诊疗安排与适用情况，请结合宠物实际病情由医生评估。</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading eyebrow="When To Visit" title="适合哪些情况来院" description="当宠物症状持续、治疗效果不明显，或需要进一步检查与评估时，可先咨询就诊安排。" />
          <BulletCards items={hospital.visitScenarios} />
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[0.85fr_1.15fr]">
            <SectionHeading eyebrow="Why Ruipeng" title={`为什么选择${hospital.name}`} description="以清晰沟通、诊疗协作与后续护理建议，为犬猫家庭提供稳妥的就诊支持。" />
            <BulletCards items={hospital.advantages} />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <SectionHeading eyebrow="Hospital Gallery" title="医院图片展示" description="真实医院图片确认并上传前，页面将保持以下占位卡片，不会加载不存在的图片文件。" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => <HospitalImageCard key={image.src} image={image} />)}
          </div>
        </section>

        <section className="bg-slate-950 text-white">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
            <SectionHeading eyebrow="Visit Process" title="就诊流程" description="从初步沟通到复诊护理，帮助犬猫家庭更清楚地了解就诊步骤。" inverted />
            <ol className="mt-10 grid gap-4 md:grid-cols-5">
              {hospital.processSteps.map((step, index) => (
                <li key={step} className="border-t border-slate-700 pt-5">
                  <span className="text-xs font-black tracking-widest text-cyan-300">STEP {index + 1}</span>
                  <h3 className="mt-3 text-base font-black">{step}</h3>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <SectionHeading eyebrow="FAQ" title="常见问题" description="以下内容用于帮助了解基础就诊信息，具体安排以医院沟通确认结果为准。" />
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {hospital.faq.map((item) => (
              <details key={item.question} className="group rounded-lg border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer list-none pr-8 text-base font-black leading-7 text-slate-900">{item.question}</summary>
                <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-7 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-lg font-black text-slate-950">{hospital.name}</p>
            <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">地址{hospital.address} · 电话{hospital.phone}</p>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-500 md:text-right">{hospital.disclaimer}</p>
        </div>
      </footer>
    </div>
  );
}

type ImageWithAvailability = HospitalImage & {
  available: boolean;
};

function HospitalImageFrame({ image, hero = false }: { image: ImageWithAvailability; hero?: boolean }) {
  return (
    <figure className={hero ? "self-end overflow-hidden rounded-xl border border-blue-100 bg-white shadow-xl shadow-blue-950/10" : "m-0"}>
      <div className="relative aspect-[4/3] overflow-hidden">
        {image.available ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={hero}
            sizes={hero ? "(max-width: 1024px) 100vw, 40vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            className="object-cover"
          />
        ) : (
          <ImagePlaceholder alt={image.alt} hero={hero} />
        )}
      </div>
      {hero ? (
        <figcaption className="border-t border-slate-100 bg-white px-5 py-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-ruipeng-blue">真实医院图片位</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{image.title} · 图片确认后展示</p>
        </figcaption>
      ) : null}
    </figure>
  );
}

function HospitalImageCard({ image }: { image: ImageWithAvailability }) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <HospitalImageFrame image={image} />
      <div className="p-5">
        <h3 className="text-base font-black text-slate-950">{image.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{image.description}</p>
      </div>
    </article>
  );
}

function ImagePlaceholder({ alt, hero = false }: { alt: string; hero?: boolean }) {
  return (
    <div
      role="img"
      aria-label={`${alt}，图片待补充`}
      className="relative grid size-full place-items-center overflow-hidden bg-gradient-to-br from-slate-100 via-white to-blue-100 p-6 text-center"
    >
      <div className="absolute -right-10 -top-10 size-40 rounded-full border-[24px] border-white/70" />
      <div className="absolute -bottom-16 -left-10 size-52 rounded-full border-[32px] border-blue-200/30" />
      <div className="relative">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-ruipeng-blue text-3xl font-light text-white shadow-lg shadow-blue-900/15">
          +
        </div>
        <p className="mt-5 text-sm font-black text-slate-700">图片待补充</p>
        <p className="mx-auto mt-2 max-w-xs text-xs font-medium leading-5 text-slate-500">
          {hero ? "此处将展示经确认的真实医院首图" : "上传经确认的真实医院图片后自动展示"}
        </p>
      </div>
    </div>
  );
}

function ActionLink({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <a href={href} className={["rounded-md px-5 py-3 text-sm font-black", primary ? "bg-ruipeng-blue text-white" : "border border-slate-300 bg-white text-slate-800"].join(" ")}>
      {children}
    </a>
  );
}

function BulletCards({ items }: { items: readonly string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <article key={item} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
          <span className="mt-1 size-2 shrink-0 rounded-full bg-ruipeng-blue" />
          <h3 className="text-sm font-bold leading-6 text-slate-700">{item}</h3>
        </article>
      ))}
    </div>
  );
}

function SectionHeading({ eyebrow, title, description, inverted = false }: { eyebrow: string; title: string; description: string; inverted?: boolean }) {
  return (
    <div className="max-w-2xl">
      <p className={["text-xs font-black uppercase tracking-[0.2em]", inverted ? "text-cyan-300" : "text-ruipeng-blue"].join(" ")}>{eyebrow}</p>
      <h2 className={["mt-3 text-3xl font-black tracking-tight sm:text-4xl", inverted ? "text-white" : "text-slate-950"].join(" ")}>{title}</h2>
      <p className={["mt-4 text-sm font-medium leading-7 sm:text-base", inverted ? "text-slate-300" : "text-slate-600"].join(" ")}>{description}</p>
    </div>
  );
}

function InfoTile({ label, value, dark = false, id }: { label: string; value: string; dark?: boolean; id?: string }) {
  return (
    <article id={id} className={["rounded-lg border p-4", dark ? "border-slate-700 bg-white/5" : "border-slate-200 bg-white"].join(" ")}>
      <h3 className={["text-xs font-black uppercase tracking-wider", dark ? "text-slate-400" : "text-slate-500"].join(" ")}>{label}</h3>
      <p className={["mt-2 text-sm font-black", dark ? "text-white" : "text-slate-950"].join(" ")}>{value}</p>
    </article>
  );
}

function buildStructuredData() {
  const pageUrl = toAbsoluteUrl(hospital.seo.canonicalPath);
  const address = isConfirmedPublicValue(hospital.address)
    ? {
        "@type": "PostalAddress",
        streetAddress: hospital.address,
        addressLocality: hospital.city,
        addressRegion: hospital.city,
        addressCountry: "CN",
      }
    : undefined;

  const veterinaryCare = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "VeterinaryCare"],
    name: hospital.name,
    description: hospital.seo.description,
    url: pageUrl,
    image: toAbsoluteUrl(hospital.seo.ogImage),
    areaServed: [hospital.city, `${hospital.city}周边`],
    serviceType: hospital.specialties,
    knowsAbout: hospital.specialties,
    specialty: hospital.specialties,
    sameAs: hospital.sameAs,
    ...(address ? { address } : {}),
    ...(isConfirmedPublicValue(hospital.phone) ? { telephone: hospital.phone } : {}),
    ...(isConfirmedPublicValue(hospital.openingHours) ? { openingHours: hospital.openingHours } : {}),
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: hospital.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "首页",
        item: toAbsoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "医院落地页",
        item: pageUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: hospital.name,
        item: pageUrl,
      },
    ],
  };

  return [veterinaryCare, faqPage, breadcrumbList];
}

function serializeStructuredData(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
