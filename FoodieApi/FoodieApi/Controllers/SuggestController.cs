using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using FoodieApi.Models;

namespace FoodieApi.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class SuggestController : ApiController
    {
        SuggestModels md = new SuggestModels();
        FoodieToolSet fts = new FoodieToolSet();

        public SuggestObject_PostResponseWrapper Post(SuggestObject_PostRequest obj)
        {
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            SuggestObject_PostResponseWrapper response = new SuggestObject_PostResponseWrapper();
            if (credentials.private_key == fts.PrivateKey)
            {
                response.isAuthorized = true;
                response.result = md.getSuggested(obj.foodict_ID, obj.fbobjects);
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }

    }
}
