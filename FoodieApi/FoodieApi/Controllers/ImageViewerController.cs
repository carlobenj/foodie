using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using FoodieApi.Models;
using System.Drawing;
using System.IO;

namespace FoodieApi.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ImageViewerController : ApiController
    {
        public HttpResponseMessage Get(int q, string c)
        {
            FoodieDBDataContext db = new FoodieDBDataContext();

            try
            {
                string image_data;
                switch (c)
                {
                    case "p":
                        //POST
                        image_data = db.posts.Any(p => p.post_ID == q) ? db.posts.Where(p => p.post_ID == q).Select(p => p.post_image).First() : "";
                        break;
                    case "f":
                        //FOODICT IMAGE
                        image_data = db.foodicts.Any(f => f.foodict_ID == q) ? db.foodicts.Where(f => f.foodict_ID == q).Select(f => f.foodict_image).First() : "";
                        break;
                    case "d":
                        //FOODUCER IMAGE
                        image_data = db.fooducers.Any(d => d.fooducer_ID == q) ? db.fooducers.Where(d => d.fooducer_ID == q).Select(d => d.fooducer_image).First() : "";
                        break;
                    case "o":
                        //OFFER IMAGE
                        image_data = db.offers.Any(o => o.offer_ID == q) ? db.offers.Where(o => o.offer_ID == q).Select(o => o.offer_image).First() : "";
                        break;
                    default:
                        image_data = "";
                        break;
                }


                //remove prefix created on canvas
                string[] delimiters = new string[] { "data:image/jpeg;base64,", "data:image/png;base64," };
                string[] images = image_data.Split(delimiters, StringSplitOptions.RemoveEmptyEntries);

                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                byte[] imageBytes = Convert.FromBase64String(images[0]);
                MemoryStream ms = new MemoryStream(imageBytes, 0, imageBytes.Length);
                response.Content = new StreamContent(ms);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("image/jpeg");
                return response;
            }
            catch 
            {
                return new HttpResponseMessage { };
            }            
        }
    }
}
