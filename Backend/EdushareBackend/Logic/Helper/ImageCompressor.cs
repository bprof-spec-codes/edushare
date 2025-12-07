using SixLabors.ImageSharp.Formats.Jpeg;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SixLabors.ImageSharp;

namespace Logic.Helper
{
    public class ImageCompressor
    {
        public async Task<string> CompressToTargetSyieAsync(string base64)
        {
            int targetSizeKb = 40;
            int toleranceKb = 3;

            var originalBytes = Convert.FromBase64String(base64);

            // Kép betöltése
            using var input = new MemoryStream(originalBytes);
            using var image = await Image.LoadAsync(input);

            int quality = 80; // induló minőség
            byte[] compressedBytes;

            while (true)
            {
                using var output = new MemoryStream();

                var encoder = new JpegEncoder
                {
                    Quality = quality
                };

                
                await image.SaveAsync(output, encoder);

                compressedBytes = output.ToArray();
                int sizeKb = compressedBytes.Length / 1024;

                
                if (sizeKb <= targetSizeKb + toleranceKb || quality <= 10)
                    break;

                
                quality -= 5;
            }

            
            return Convert.ToBase64String(compressedBytes);
        }
    }
}
