namespace StockManagementAPI
{
  public class Vehicle
  {
    public int Id { get; set; }
    public string RegistrationNumber { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public string ModelDescription { get; set; } = string.Empty;
    public int ModelYear { get; set; }
    public int KilometreReading { get; set; } = 0;
    public string Colour { get; set; } = string.Empty;
    public string VIN { get; set; } = string.Empty;
    public string Accessories { get; set; } = string.Empty;
    public int RetailPrice  { get; set; } = 0;
    public int CostPrice { get; set; } = 0;
    public DateTime DTCreated { get; set; }
    public DateTime DTUpdated { get; set; }

  }
}
