namespace StockManagementAPI
{
  public class Accessory
  {
    public int Id { get; set; }
    public int VehicleId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

  }
}
