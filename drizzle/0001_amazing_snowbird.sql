CREATE TABLE "user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"nama" varchar(255),
	"email" varchar(255),
	"no_hp" varchar(50),
	"jabatan" varchar(255),
	"unit_kerja" varchar(255),
	"alamat_kantor" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "instansi" (
	"id" integer PRIMARY KEY NOT NULL,
	"instansi_id" integer NOT NULL,
	"nama_instansi" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "koperasi_pilar" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama_pilar" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kegiatan" (
	"id" integer PRIMARY KEY NOT NULL,
	"pilar_id" integer NOT NULL,
	"nama_kegiatan" varchar(500) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"urutan" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "action_plan_pic" (
	"id" serial PRIMARY KEY NOT NULL,
	"action_plans_id" integer NOT NULL,
	"pic_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "action_plan_progress" (
	"id" integer PRIMARY KEY NOT NULL,
	"action_plan_pic_id" integer NOT NULL,
	"target" integer,
	"capaian" integer,
	"bukti" text,
	"penjelasan" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "action_plan_schedule" (
	"id" serial PRIMARY KEY NOT NULL,
	"action_plans_id" integer NOT NULL,
	"okt" boolean DEFAULT false,
	"nov" boolean DEFAULT false,
	"des" boolean DEFAULT false,
	"tw1" boolean DEFAULT false,
	"tw2" boolean DEFAULT false,
	"tw3" boolean DEFAULT false,
	"tw4" boolean DEFAULT false,
	"tahun_2027" boolean DEFAULT false,
	"tahun_2028" boolean DEFAULT false,
	"tahun_2029" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "action_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"kegiatan_id" integer NOT NULL,
	"output" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"status" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "indikator_keberhasilan_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"action_plans_id" integer NOT NULL,
	"urutan" integer NOT NULL,
	"deskripsi" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "target" (
	"id" serial PRIMARY KEY NOT NULL,
	"action_plans_id" integer NOT NULL,
	"tahun" integer NOT NULL,
	"nilai_target" numeric,
	"satuan" varchar(50),
	"keterangan" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"target_date" timestamp,
	"priority" text DEFAULT 'medium' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"assigned_to" text,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "instansi_id" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "kegiatan" ADD CONSTRAINT "kegiatan_pilar_id_koperasi_pilar_id_fk" FOREIGN KEY ("pilar_id") REFERENCES "public"."koperasi_pilar"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_plan_pic" ADD CONSTRAINT "action_plan_pic_action_plans_id_action_plans_id_fk" FOREIGN KEY ("action_plans_id") REFERENCES "public"."action_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_plan_pic" ADD CONSTRAINT "action_plan_pic_pic_id_instansi_id_fk" FOREIGN KEY ("pic_id") REFERENCES "public"."instansi"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_plan_progress" ADD CONSTRAINT "action_plan_progress_action_plan_pic_id_action_plan_pic_id_fk" FOREIGN KEY ("action_plan_pic_id") REFERENCES "public"."action_plan_pic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_plan_schedule" ADD CONSTRAINT "action_plan_schedule_action_plans_id_action_plans_id_fk" FOREIGN KEY ("action_plans_id") REFERENCES "public"."action_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "indikator_keberhasilan_detail" ADD CONSTRAINT "indikator_keberhasilan_detail_action_plans_id_action_plans_id_fk" FOREIGN KEY ("action_plans_id") REFERENCES "public"."action_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "target" ADD CONSTRAINT "target_action_plans_id_action_plans_id_fk" FOREIGN KEY ("action_plans_id") REFERENCES "public"."action_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "actions" ADD CONSTRAINT "actions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "kegiatan_pilar_id_idx" ON "kegiatan" USING btree ("pilar_id");--> statement-breakpoint
CREATE INDEX "action_plan_progress_action_plan_pic_id_idx" ON "action_plan_progress" USING btree ("action_plan_pic_id");--> statement-breakpoint
CREATE INDEX "action_plan_schedule_action_plans_id_idx" ON "action_plan_schedule" USING btree ("action_plans_id");--> statement-breakpoint
CREATE INDEX "status_idx" ON "action_plans" USING btree ("status");--> statement-breakpoint
CREATE INDEX "action_plans_kegiatan_id_idx" ON "action_plans" USING btree ("kegiatan_id");--> statement-breakpoint
CREATE INDEX "indikator_keberhasilan_detail_action_plans_id_idx" ON "indikator_keberhasilan_detail" USING btree ("action_plans_id");--> statement-breakpoint
CREATE INDEX "indikator_keberhasilan_detail_urutan_idx" ON "indikator_keberhasilan_detail" USING btree ("urutan");--> statement-breakpoint
CREATE INDEX "target_action_plans_id_idx" ON "target" USING btree ("action_plans_id");--> statement-breakpoint
CREATE INDEX "target_tahun_idx" ON "target" USING btree ("tahun");