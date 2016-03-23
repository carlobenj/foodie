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
    public class ArchiveController : ApiController
    {
        ArchiveModels md = new ArchiveModels();
        FoodieToolSet fts = new FoodieToolSet();

        public ArchiveObjectGet_ResponseWrapper Get(string api_key, int fooducer_ID)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            ArchiveObjectGet_ResponseWrapper response = new ArchiveObjectGet_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == fooducer_ID)
            {
                response.isAuthorized = true;
                response.result = md.getArchives(credentials.MyID);
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }

        public ArchiveObjectPost_ResponseWrapper Post(ArchiveObjectPost_Request obj)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            ArchiveObjectPost_ResponseWrapper response = new ArchiveObjectPost_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == obj.fooducer_ID)
            {
                response.isAuthorized = true;
                response.result = md.getArchiveDetails(obj.offer_ID, credentials.MyID);
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
