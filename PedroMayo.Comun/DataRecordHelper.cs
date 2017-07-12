using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace PedroMayo.Comun
{
    public class DataRecordHelper
    {
        public static List<T> ConvertTo<T>(IDataReader reader) where T : new()
        {
            List<T> aux = new List<T>();

            while (reader.Read())
            {
                T obj1 = new T();

                PropertyInfo[] propertyInfos = typeof(T).GetProperties();

                for (int i = 0; i < reader.FieldCount; i++)
                {
                    foreach (PropertyInfo propertyInfo in propertyInfos)
                    {
                        if (propertyInfo.Name == reader.GetName(i))
                        {
                            propertyInfo.SetValue(obj1, Convert.ChangeType(reader.GetValue(i), reader.GetFieldType(i)), null);
                            break;
                        }
                    }
                }

                aux.Add(obj1);
            }

            return aux;
        }
    }
}
