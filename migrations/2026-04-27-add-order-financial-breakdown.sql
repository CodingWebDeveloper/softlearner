ALTER TABLE orders
ADD COLUMN IF NOT EXISTS platform_fee_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS stripe_fee_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS net_amount DECIMAL(10,2);

UPDATE orders
SET
  platform_fee_amount = ROUND(total_amount * 0.10, 2),
  net_amount = ROUND(total_amount - ROUND(total_amount * 0.10, 2), 2)
WHERE platform_fee_amount IS NULL
  OR net_amount IS NULL;
