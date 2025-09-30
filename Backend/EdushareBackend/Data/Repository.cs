using Entities.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data
{
    public class Repository<T> where T : class, IIdEntity
    {
        RepositoryContext ctx;

        public Repository(RepositoryContext ctx)
        {
            this.ctx = ctx;
        }

        public void Add(T entity)
        {
            ctx.Set<T>().Add(entity);
            ctx.SaveChanges();
        }

        public void DeleteById(string id)
        { 
            var entity = ctx.Set<T>().First(e => e.Id == id);
            ctx.Set<T>().Remove(entity);
            ctx.SaveChanges();
        }
    }
}
