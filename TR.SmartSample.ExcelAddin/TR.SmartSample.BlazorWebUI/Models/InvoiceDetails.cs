namespace TR.SmartSample.BlazorWebUI.Models
{
    public class InvoiceDetails
    {
        public required string InvoiceDate { get; set; }
        public required string InvoiceId { get; set; }
        public decimal InvoiceTotal { get; set; }
    }
}
