using Microsoft.AspNetCore.Http; // Add this namespace for IFormFile
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockManagementAPI.Data;

namespace StockManagementAPI.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class StockImagesController : ControllerBase
  {
    private readonly DataContext _context;

    public StockImagesController(DataContext context)
    {
      _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<stockImagesDto>>> GetStockImages()
    {
      var stockImages = await _context.StockImages.ToListAsync();

      // Create a new list of StockImagesDto with image bytes as Base64 strings
      var stockImagesDto = stockImages.Select(s => new stockImagesDto
      {
        Id = s.Id,
        StockId = s.StockId,
        Image = Convert.ToBase64String(s.Image)
      }).ToList();

      return Ok(stockImagesDto);
    }

    [HttpPost("{id}")]
    public async Task<IActionResult> createStockImages(List<IFormFile> images, int id)
    {
      if (images == null || images.Count == 0)
        return BadRequest("No image files provided.");

      if (id <= 0)
        return BadRequest("Invalid ID value.");

      foreach (var image in images)
      {
        if (image == null || image.Length == 0)
          continue;

        // Read the image data into a byte array
        using (var memoryStream = new MemoryStream())
        {
          await image.CopyToAsync(memoryStream);
          byte[] imageBytes = memoryStream.ToArray();

          // Create a new StockImages object
          var stockImage = new StockImages
          {
            StockId = id,
            Image = imageBytes
          };

          // Add the stockImage to the context and save changes
          _context.StockImages.Add(stockImage);
          await _context.SaveChangesAsync();
        }
      }

      return Ok(await _context.StockImages.ToListAsync());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> updateStockImages(List<IFormFile> images, int id)
    {
      if (images == null || images.Count == 0)
        return BadRequest("No image files provided.");

      if (id <= 0)
        return BadRequest("Invalid ID value.");


      var stockImagesToUpdate = await _context.StockImages
          .Where(s => s.StockId == id)
          .ToListAsync();

      if (stockImagesToUpdate == null || stockImagesToUpdate.Count == 0)
        return Ok(await _context.StockImages.ToListAsync());

      _context.StockImages.RemoveRange(stockImagesToUpdate);
      await _context.SaveChangesAsync();

      foreach (var image in images)
      {
        if (image == null || image.Length == 0)
          continue;

        // Read the image data into a byte array
        using (var memoryStream = new MemoryStream())
        {
          await image.CopyToAsync(memoryStream);
          byte[] imageBytes = memoryStream.ToArray();

          // Create a new StockImages object
          var stockImage = new StockImages
          {
            StockId = id,
            Image = imageBytes
          };

          // Add the stockImage to the context and save changes
          _context.StockImages.Add(stockImage);
          await _context.SaveChangesAsync();
        }
      }

      var stockImages = await _context.StockImages.ToListAsync();

      var stockImagesDto = stockImages.Where(s => s.StockId == id).Select(s => new stockImagesDto {
          Id = s.Id,
          StockId = s.StockId,
          Image = Convert.ToBase64String(s.Image)
      }).ToList();

      return Ok(stockImagesDto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStockImages(int id)
    {
      var stockImages = await _context.StockImages
          .Where(s => s.StockId == id)
          .ToListAsync();

      if (stockImages == null || stockImages.Count == 0)
        return Ok(await _context.StockImages.ToListAsync());

      _context.StockImages.RemoveRange(stockImages);
      await _context.SaveChangesAsync();

      return Ok(await _context.StockImages.ToListAsync());
    }

  }
}
