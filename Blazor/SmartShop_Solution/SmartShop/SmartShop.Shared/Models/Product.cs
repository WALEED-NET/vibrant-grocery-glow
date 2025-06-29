namespace SmartShop.Shared.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string Unit { get; set; } = string.Empty;
        public decimal CurrentQuantity { get; set; }
        public decimal MinimumQuantity { get; set; }
        public decimal PurchasePrice { get; set; }
        public decimal ProfitMargin { get; set; }
        public int? ShortcutNumber { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string? Description { get; set; }

        public decimal SellingPrice => (PurchasePrice * 680 + ProfitMargin) / 680;
        public bool IsLowStock => CurrentQuantity <= MinimumQuantity;
        public bool IsExpiringSoon => ExpiryDate.HasValue && ExpiryDate.Value <= DateTime.Now.AddDays(30);
    }

    public class ProductForm
    {
        public string Name { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string Unit { get; set; } = string.Empty;
        public decimal CurrentQuantity { get; set; }
        public decimal MinimumQuantity { get; set; }
        public decimal PurchasePrice { get; set; }
        public decimal ProfitMargin { get; set; }
        public int? ShortcutNumber { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string? Description { get; set; }
    }
}