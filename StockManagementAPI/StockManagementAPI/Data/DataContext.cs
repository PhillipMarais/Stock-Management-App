using Microsoft.EntityFrameworkCore;

namespace StockManagementAPI.Data
{
  public class DataContext : DbContext
  {
    public DataContext(DbContextOptions<DataContext> options): base(options) { }

    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<StockImages> StockImages => Set<StockImages>();
  }
}
