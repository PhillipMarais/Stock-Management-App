using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockManagementAPI.Data;
using Microsoft.AspNetCore.Cors;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace StockManagementAPI.Controllers
{
  [Route("api/[controller]")]
  [ApiController]


  public class VehicleController : ControllerBase
  {
    private readonly DataContext _context;

    public VehicleController(DataContext context)
    {
      _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Vehicle>>> GetVehicles()
    {
      return Ok(await _context.Vehicles.ToListAsync());
    }

    [HttpPost]
    public async Task<ActionResult<List<Vehicle>>> CreateVehicle(Vehicle vehicle)
    {
      _context.Vehicles.Add(vehicle);
      await _context.SaveChangesAsync();

      return Ok(await _context.Vehicles.ToListAsync());
    }

    [HttpPut]
    public async Task<ActionResult<List<Vehicle>>> UpdateVehicle(Vehicle vehicle)
    {
      var dbVehicle = await _context.Vehicles.FindAsync(vehicle.Id);
      if (dbVehicle == null)
        return BadRequest("Vehicle does not exist");

      dbVehicle.RegistrationNumber = vehicle.RegistrationNumber;
      dbVehicle.Manufacturer = vehicle.Manufacturer;
      dbVehicle.ModelDescription = vehicle.ModelDescription;
      dbVehicle.ModelYear = vehicle.ModelYear;
      dbVehicle.KilometreReading = vehicle.KilometreReading;
      dbVehicle.Colour = vehicle.Colour;
      dbVehicle.VIN = vehicle.VIN;
      dbVehicle.RetailPrice = vehicle.RetailPrice;
      dbVehicle.CostPrice = vehicle.CostPrice;
      dbVehicle.DTUpdated = DateTime.Now;
      await _context.SaveChangesAsync();

      return Ok(await _context.Vehicles.ToListAsync());
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<List<Vehicle>>> DeleteVehicle(int id)
    {
      var dbVehicle = await _context.Vehicles.FindAsync(id);
      if (dbVehicle == null)
        return BadRequest("Vehicle does not exist");

      _context.Vehicles.Remove(dbVehicle);
      await _context.SaveChangesAsync();

      return Ok(await _context.Vehicles.ToListAsync());
    }
  }

}
