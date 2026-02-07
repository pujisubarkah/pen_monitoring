CREATE TABLE IF NOT EXISTS "pen_monitoring"."user_instansi_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"instansi_id" integer NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL,
	"assigned_by" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pen_monitoring"."user_instansi_assignments" ADD CONSTRAINT "user_instansi_assignments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "pen_monitoring"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pen_monitoring"."user_instansi_assignments" ADD CONSTRAINT "user_instansi_assignments_instansi_id_instansi_id_fk" FOREIGN KEY ("instansi_id") REFERENCES "pen_monitoring"."instansi"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_instansi_idx" ON "pen_monitoring"."user_instansi_assignments" USING btree ("user_id","instansi_id");

-- Migrate existing instansi_id data from users table to junction table
INSERT INTO "pen_monitoring"."user_instansi_assignments" (user_id, instansi_id, assigned_at)
SELECT id, instansi_id, created_at
FROM "pen_monitoring"."users"
WHERE instansi_id IS NOT NULL AND role = 'admin';
