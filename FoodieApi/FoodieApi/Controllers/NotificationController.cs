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
    public class NotificationController : ApiController
    {
        NotificationModels md = new NotificationModels();
        FoodieToolSet fts = new FoodieToolSet();

        public NotificationObjectGet_ResponseWrapper Get(string api_key, int user_ID, int foodict_ID)
        {
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            NotificationObjectGet_ResponseWrapper response = new NotificationObjectGet_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == foodict_ID)
            {
                response.isAuthorized = true;
                response.result = md.getNewNotificationCount(foodict_ID); //other foodict
            }
            else
            {
                response.isAuthorized = false;
                response.result = 0;
            }
            return response;
        }

        public NotificationObject_ResponseWrapper Post(NotificationObjectPost_Request obj)
        {
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            NotificationObject_ResponseWrapper response = new NotificationObject_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == obj.foodict_ID)
            {
                response.isAuthorized = true;
                response.result = md.getMyNotifications(obj.foodict_ID); //other foodict
            }
            else
            {
                response.isAuthorized = false;
                response.result = null;
            }
            return response;
        }

        public NotificationObjectPutDelete_ResponseWrapper Put(NotificationObjectPut_Request obj)
        {
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(obj.api_key);

            NotificationObjectPutDelete_ResponseWrapper response = new NotificationObjectPutDelete_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == obj.foodict_ID)
            {
                response.isAuthorized = true;
                response.result = md.markAllNotifications(obj.items_ID); //other foodict
            }
            else
            {
                response.isAuthorized = false;
                response.result = false;
            }
            return response;
        }
        public NotificationObjectPutDelete_ResponseWrapper Delete(string api_key, int user_ID, int foodict_ID, int notification_ID)
        {
            CredentialsObject credentials = new CredentialsObject();
            credentials = fts.GetCredentials(api_key);

            NotificationObjectPutDelete_ResponseWrapper response = new NotificationObjectPutDelete_ResponseWrapper();
            if (credentials.private_key == fts.PrivateKey && credentials.MyID == foodict_ID)
            {
                response.isAuthorized = true;
                response.result = md.deleteNotification(notification_ID); //other foodict
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
