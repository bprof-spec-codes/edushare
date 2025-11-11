
using Data;
using EdushareBackend.Helpers;
using Entities.Models;
using Logic.Helper;
using Logic.Logic;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Entities.Helpers;

namespace EdushareBackend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            //Connection string from json file
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            
            //JWT configuration from json file
            //The defined properties are now in a class, inside the properties of it
            builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
            
            var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>();
            
            var jwtIssuer = jwtSettings!.Issuer;
            var jwtKey = jwtSettings!.Key;
            
            //Cors configuration from json file
            var frontendUrl = builder.Configuration["Cors:FrontendUrl"];
            
            builder.WebHost.UseUrls("http://0.0.0.0:5001");

            // Add services to the container.

            builder.Services.AddCors(option =>
            {
                option.AddPolicy("AllowAngularApp", policy =>
                {
                    policy.WithOrigins(frontendUrl!)
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                });
            });

            builder.Services.AddTransient(typeof(Repository<>));
            builder.Services.AddTransient<DtoProviders>();
            builder.Services.AddTransient<MaterialLogic>();
            builder.Services.AddTransient<SubjectLogic>();
            builder.Services.AddTransient<StatisticsLogic>();
            builder.Services.AddTransient<RatingLogic>();

            builder.Services.AddIdentity<AppUser, IdentityRole>(
                option =>
                {
                    option.Password.RequireDigit = false;
                    option.Password.RequiredLength = 8;
                    option.Password.RequireNonAlphanumeric = false;
                    option.Password.RequireUppercase = false;
                    option.Password.RequireLowercase = false;
                })
                .AddEntityFrameworkStores<RepositoryContext>()   
                .AddDefaultTokenProviders();

            builder.Services.AddAuthentication(option =>
            {
                option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                option.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = true;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = jwtIssuer,
                    ValidIssuer = jwtIssuer,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                };
            }); ;

            builder.Services.AddDbContext<RepositoryContext>(options =>
            {
                options.UseSqlServer(connectionString);
            });

            builder.Services.Configure<ApiBehaviorOptions>(options =>
            {
                options.SuppressModelStateInvalidFilter = true;
            });

            builder.Services.AddControllers(opt =>
            {
                opt.Filters.Add<ExceptionFilter>();
                opt.Filters.Add<ValidationFilterAttribute>();
            });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddSwaggerGen(option =>
            {
                option.SwaggerDoc("v1", new OpenApiInfo { Title = "Edushare API", Version = "v1" });
                option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter a valid token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });
                option.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type=ReferenceType.SecurityScheme,
                                Id="Bearer"
                            }
                        },
                        new string[]{}
                    }
                });
            });


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("AllowAngularApp");

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseStaticFiles();

            app.MapControllers();

            app.Run();
        }
    }
}
