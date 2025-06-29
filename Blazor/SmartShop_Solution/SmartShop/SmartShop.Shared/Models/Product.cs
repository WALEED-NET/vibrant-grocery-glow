using System.ComponentModel.DataAnnotations;

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
        [Required(ErrorMessage = "اسم المنتج مطلوب")]
        [StringLength(100, ErrorMessage = "اسم المنتج يجب أن يكون أقل من 100 حرف")]
        public string Name { get; set; } = string.Empty;
        
        public string? Category { get; set; }
        
        [Required(ErrorMessage = "الوحدة مطلوبة")]
        public string Unit { get; set; } = string.Empty;
        
        [Range(0, double.MaxValue, ErrorMessage = "الكمية الحالية يجب أن تكون أكبر من أو تساوي صفر")]
        public decimal CurrentQuantity { get; set; }
        
        [Range(0, double.MaxValue, ErrorMessage = "الحد الأدنى يجب أن يكون أكبر من أو تساوي صفر")]
        public decimal MinimumQuantity { get; set; }
        
        [Required(ErrorMessage = "سعر الشراء مطلوب")]
        [Range(0.01, double.MaxValue, ErrorMessage = "سعر الشراء يجب أن يكون أكبر من صفر")]
        public decimal PurchasePrice { get; set; }
        
        [Required(ErrorMessage = "هامش الربح مطلوب")]
        [Range(0.01, double.MaxValue, ErrorMessage = "هامش الربح يجب أن يكون أكبر من صفر")]
        public decimal ProfitMargin { get; set; }
        
        [Range(1, 999, ErrorMessage = "رقم الاختصار يجب أن يكون بين 1 و 999")]
        public int? ShortcutNumber { get; set; }
        
        public DateTime? ExpiryDate { get; set; }
        
        [StringLength(500, ErrorMessage = "الوصف يجب أن يكون أقل من 500 حرف")]
        public string? Description { get; set; }
    }
}