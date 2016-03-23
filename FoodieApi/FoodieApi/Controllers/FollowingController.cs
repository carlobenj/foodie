﻿using System;
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
    public class FollowingController : ApiController
    {
        FollowingModels md = new FollowingModels();
        FoodieToolSet fts = new FoodieToolSet();

        public FollowingObject_ResponseWrapper Get(string api_key, int foodict_ID, int target_foodict_ID)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            FollowingObject_ResponseWrapper response = new FollowingObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == foodict_ID)
            {
                response.isAuthorized = true;
                response.result = md.getFollowing(credentials.MyID, target_foodict_ID); //foodict
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
