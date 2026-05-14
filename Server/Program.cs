using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ReservationSystem_backend;
using ReservationSystem_backend.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

ConfigurationManager configuration = builder.Configuration;

// Retrieve the connection string from configuration
var connectionString = configuration.GetConnectionString("defaultConnection");

// Add Database service
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, new MariaDbServerVersion(new Version(10, 4, 32)),
    b => b.MigrationsAssembly("ReservationSystem_backend")));

// For Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Adding Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})

// Adding Jwt Bearer
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = configuration["JWT:ValidAudience"],
        ValidIssuer = configuration["JWT:ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]))
    };
});

builder.Services.AddHttpContextAccessor();

// Add services to the container.
var MyPolicy = "Mypolicy";
builder.Services.AddCors(options => options.AddPolicy(name: MyPolicy, policy =>
{
    policy.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader();
    policy.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader();
}));

builder.Services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Scoped Services and Repositories
builder.Services.AddScoped<ReservationSystem_backend.Services.CustomerService.ICustomerService, ReservationSystem_backend.Services.CustomerService.CustomerService>();
builder.Services.AddScoped<ReservationSystem_backend.Repository.CustomerRepo.ICustomerRepo, ReservationSystem_backend.Repository.CustomerRepo.CustomerRepo>();

builder.Services.AddScoped<ReservationSystem_backend.Services.PilotService.IPilotService, ReservationSystem_backend.Services.PilotService.PilotService>();
builder.Services.AddScoped<ReservationSystem_backend.Repository.PilotRepo.IPilotRepo, ReservationSystem_backend.Repository.PilotRepo.PilotRepo>();

builder.Services.AddScoped<ReservationSystem_backend.Services.PilotGroupService.IPilotGroupService, ReservationSystem_backend.Services.PilotGroupService.PilotGroupService>();

builder.Services.AddScoped<ReservationSystem_backend.Services.TransportGroupService.ITransportGroupService, ReservationSystem_backend.Services.TransportGroupService.TransportGroupService>();
builder.Services.AddScoped<ReservationSystem_backend.Repository.TransportGroupRepo.ITransportGroupRepo, ReservationSystem_backend.Repository.TransportGroupRepo.TransportGroupRepo>();

builder.Services.AddScoped<ReservationSystem_backend.Services.FlightPackageService.IFlightPackageService, ReservationSystem_backend.Services.FlightPackageService.FlightPackageService>();
builder.Services.AddScoped<ReservationSystem_backend.Repository.FlightPackageRepo.IFlightPackageRepo, ReservationSystem_backend.Repository.FlightPackageRepo.FlightPackageRepo>();

builder.Services.AddScoped<ReservationSystem_backend.Services.ExtraServiceService.IExtraServiceService, ReservationSystem_backend.Services.ExtraServiceService.ExtraServiceService>();
builder.Services.AddScoped<ReservationSystem_backend.Repository.ExtraServiceRepo.IExtraServiceRepo, ReservationSystem_backend.Repository.ExtraServiceRepo.ExtraServiceRepo>();

builder.Services.AddScoped<ReservationSystem_backend.Services.ReservationService.IReservationService, ReservationSystem_backend.Services.ReservationService.ReservationService>();
builder.Services.AddScoped<ReservationSystem_backend.Repository.ReservationRepo.IReservationRepo, ReservationSystem_backend.Repository.ReservationRepo.ReservationRepo>();

builder.Services.AddScoped<ReservationSystem_backend.Services.PaymentService.IPaymentService, ReservationSystem_backend.Services.PaymentService.PaymentService>();
builder.Services.AddScoped<ReservationSystem_backend.Repository.PaymentRepo.IPaymentRepo, ReservationSystem_backend.Repository.PaymentRepo.PaymentRepo>();

builder.Services.AddScoped<ReservationSystem_backend.Services.FlightTimeService.IFlightTimeService, ReservationSystem_backend.Services.FlightTimeService.FlightTimeService>();
builder.Services.AddScoped<ReservationSystem_backend.Repository.FlightTimeRepo.IFlightTimeRepo, ReservationSystem_backend.Repository.FlightTimeRepo.FlightTimeRepo>();

builder.Services.AddScoped<ReservationSystem_backend.Services.AgencyService.IAgencyService, ReservationSystem_backend.Services.AgencyService.AgencyService>();
builder.Services.AddScoped<ReservationSystem_backend.Repository.AgencyRepo.IAgencyRepo, ReservationSystem_backend.Repository.AgencyRepo.AgencyRepo>();

var app = builder.Build();
app.UseCors(MyPolicy); // Use CORS before any other middleware

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
