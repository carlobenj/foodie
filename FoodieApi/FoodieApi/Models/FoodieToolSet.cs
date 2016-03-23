using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using System.Configuration;
using Microsoft.WindowsAzure;
using System.Drawing;

namespace FoodieApi.Models
{
    public class FoodieToolSet
    {
        static readonly string SaltKey = "S@l+KeyXyeK+l@S"; //required po ito
        static readonly string VIKey = "V090!594K275362Y"; //required po ito
        //public readonly string PrivateKey = "%+?3A+eD&y<@R103eN/@1N(01^8io";
        public readonly string PrivateKey = Convert.ToString(DateTime.UtcNow.Day * DateTime.UtcNow.DayOfYear * 0.60214);
        protected readonly string Hash = "%+?3A+eD&y<@R103eN/@1N(01^8io";
        FoodieDBDataContext db = new FoodieDBDataContext();

        //PASSWORD HASH PARAMETER yung ipang eencryt and decrypt na data
        public string EncryptData(int id, string PasswordHash)
        {
            string data = id.ToString() + "%pinagdugtongdito%" + PrivateKey;
            if (!(String.IsNullOrWhiteSpace(data)))
            {
                byte[] plainTextBytes = Encoding.UTF8.GetBytes(data);

                byte[] keyBytes = new Rfc2898DeriveBytes(PasswordHash, Encoding.ASCII.GetBytes(SaltKey)).GetBytes(256 / 8);
                var symmetricKey = new RijndaelManaged() { Mode = CipherMode.CBC, Padding = PaddingMode.Zeros };
                var encryptor = symmetricKey.CreateEncryptor(keyBytes, Encoding.ASCII.GetBytes(VIKey));

                byte[] cipherTextBytes;

                using (var memoryStream = new MemoryStream())
                {
                    using (var cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length);
                        cryptoStream.FlushFinalBlock();
                        cipherTextBytes = memoryStream.ToArray();
                        cryptoStream.Close();
                    }
                    memoryStream.Close();
                }
                return Convert.ToBase64String(cipherTextBytes);
            }
            else
            {
                return null;
            }
        }
        public static string DecryptData(string encrypteddata, string PasswordHash)
        {
            if (!(String.IsNullOrWhiteSpace(encrypteddata)))
            {
                byte[] cipherTextBytes = Convert.FromBase64String(encrypteddata);
                byte[] keyBytes = new Rfc2898DeriveBytes(PasswordHash, Encoding.ASCII.GetBytes(SaltKey)).GetBytes(256 / 8);
                var symmetricKey = new RijndaelManaged() { Mode = CipherMode.CBC, Padding = PaddingMode.None };

                var decryptor = symmetricKey.CreateDecryptor(keyBytes, Encoding.ASCII.GetBytes(VIKey));
                var memoryStream = new MemoryStream(cipherTextBytes);
                var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read);
                byte[] plainTextBytes = new byte[cipherTextBytes.Length];

                int decryptedByteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
                memoryStream.Close();
                cryptoStream.Close();
                return Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount).TrimEnd("\0".ToCharArray());
            }
            else
            {
                return null;
            }

        }

        public bool createNotification(int notification_type, int notification_source_foodict_ID, int notification_target_foodict_ID, int notification_misc_ID_1 = 0, int notification_misc_ID_2 = 0, int? notification_misc_data_int = 0, string notification_misc_data_string1 = null, string notification_misc_data_string2 = null)
        {

            //First Level Notifications
            //0 = Administrative, 1 = Bite, 2 = Comment, 3 = Follow, 5 = FB Friend on Foodie

            //Second Level Notifications
            //11 = Follower Request

            /*REPORTS
            111 -  post inappropriate deleted
            112 -  post inappropriate penalty 
             
            121 -  post spam deleted             
            122 -  post spam penalize
             
            211 -  comment offensive deleted
            212 -  comment offensive penalty
             
            221 -  comment spam deleted
            222 -  comment spam penalize
            */
            try
            {
                notification obj = new notification();
                obj.notification_type = notification_type;
                obj.notification_source_foodict_ID = notification_source_foodict_ID;
                obj.notification_target_foodict_ID = notification_target_foodict_ID;
                obj.notification_misc_ID_1 = notification_misc_ID_1;
                obj.notification_misc_ID_2 = notification_misc_ID_2;
                obj.notification_misc_data_int = notification_misc_data_int;
                obj.notification_misc_data_string1 = notification_misc_data_string1;
                obj.notification_misc_data_string2 = notification_misc_data_string2;
                obj.notification_isDone = false;
                obj.notification_date = DateTime.UtcNow;

                db.notifications.InsertOnSubmit(obj);
                db.SubmitChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        public CredentialsObject GetCredentials(string encrypted_credentials)
        {
            string decrypted_data = DecryptData(encrypted_credentials, Hash);
            string[] delimiters = new string[] { "%pinagdugtongdito%" };
            string[] credentials_array = decrypted_data.Split(delimiters, StringSplitOptions.RemoveEmptyEntries);

            CredentialsObject result = new CredentialsObject();
            result.MyID = Convert.ToInt16(credentials_array[0]);
            result.private_key = credentials_array[1];
            return result;
        }

        public string foodieAzureStorageUpload(string image_stream, string image_name, string container_name)
        {
            try
            {
                //AZUREBLOBSTORAGE START
                CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
                CloudConfigurationManager.GetSetting("StorageConnectionString"));

                // Create the blob client.
                CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

                //Retrieve the container
                CloudBlobContainer container = blobClient.GetContainerReference(container_name);
                container.CreateIfNotExists();

                // Retrieve reference to a blob named "image_name".
                CloudBlockBlob blockBlob = container.GetBlockBlobReference(image_name + DateTime.UtcNow.ToString());

                // Create or overwrite the "image_name" blob with contents from a image.
                string[] delimiters = new string[] { "data:image/jpeg;base64,", "data:image/png;base64," };
                string[] images = image_stream.Split(delimiters, StringSplitOptions.RemoveEmptyEntries);
                byte[] bytes = Convert.FromBase64String(images[0]);
                blockBlob.UploadFromByteArrayAsync(bytes, 0, bytes.Length);
                //AZUREBLOBSTORAGE END

                return blockBlob.Uri.ToString();
            }
            catch
            {
                return null;
            }

        }

        public bool foodieAzureStorageDelete(string image_name, string container_name)
        {
            try
            {
                //AZUREBLOBSTORAGE START
                CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
                CloudConfigurationManager.GetSetting("StorageConnectionString"));

                // Create the blob client.
                CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

                //Retrieve the container
                CloudBlobContainer container = blobClient.GetContainerReference(container_name);
                container.CreateIfNotExists();

                // Retrieve reference to a blob named "image_name".
                CloudBlockBlob blockBlob = container.GetBlockBlobReference(image_name);

                //delete
                blockBlob.Delete();

                //AZUREBLOBSTORAGE END

                return true;
            }
            catch
            {
                return false;
            }

        }

    }

    public class CredentialsObject
    {
        public string private_key;
        public int MyID;
    }
}