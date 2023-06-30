using Microsoft.EntityFrameworkCore;
using StockManagementAPI.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DataContext>(options => {
  options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors(options => options.AddPolicy(name: "StockManagement",
  policy => {
    policy.WithOrigins( "https://localhost:7199", "http://localhost:4200", "http://localhost:8082", "https://stock-management-demo.web.app").AllowAnyMethod().AllowAnyHeader();
  })
);

var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}


app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("StockManagement");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
