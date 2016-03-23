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
    public class OfferController : ApiController
    {
        OfferModels md = new OfferModels();
        FoodieToolSet fts = new FoodieToolSet();
        public OfferObjectGet_ResponseWrapper Get(string api_key, int foodict_ID, decimal top = 0, decimal bottom = 0, decimal left = 0, decimal right = 0, int offer_ID = 0)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            OfferObjectGet_ResponseWrapper response = new OfferObjectGet_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey)
            {
                response.isAuthorized = true;
                response.result = md.getOffers(top, bottom, left, right, offer_ID); //foodict
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }
        public OfferObjectUpdates_Response Get(int offer_ID)
        {
            //credentials decryption
            return md.getUpdates(offer_ID);
        }

        public OfferObjectPost_ResponseWrapper Post(OfferObjectPost_Request obj)
        {
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            OfferObjectPost_ResponseWrapper response = new OfferObjectPost_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey)
            {
                response.isAuthorized = true;
                response.result = md.availVoucher(obj.offer_ID, obj.foodict_ID); //foodict
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
