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
    public class ProfileController : ApiController
    {
        ProfileModels md = new ProfileModels();
        FoodieToolSet fts = new FoodieToolSet();

        public ProfileObject_ResponseWrapper Get(string api_key, int user_ID, int foodict_ID)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            ProfileObject_ResponseWrapper response = new ProfileObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == foodict_ID)
            {
                response.isAuthorized = true;
                response.result = md.getMyProfileDetails(user_ID, credentials.MyID); //foodict
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }
        public ProfileObjectGrid_ResponseWrapper Post(ProfileObjectGrid_Request obj)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            ProfileObjectGrid_ResponseWrapper response = new ProfileObjectGrid_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey)
            {
                response.isAuthorized = true;
                ProfileObjectGrid_Response res = md.getPostsGrid(obj.target_foodict_ID, obj.foodict_ID); //foodict
                response.isLocked = res.isLocked;
                response.result = res.allPost;
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }

        public EditProfileObject_ResponseWrapper Put(ProfileEditObject_Request obj)
        {
            //credentials decryption
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            EditProfileObject_ResponseWrapper response = new EditProfileObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == obj.foodict_ID)
            {
                response.isAuthorized = true;
                response.result = md.editMyProfileDetails(obj); //foodict
            }
            else
            {
                response.isAuthorized = false;
                response.result = false;
            }
            return response;
        }
    }
}
