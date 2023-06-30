namespace StockManagementAPI
{
  public class Images
  {
    public int Id { get; set; }

    public int VehicleId { get; set; }
    public byte[]? ImageBinary { get; set; }
  }
}
