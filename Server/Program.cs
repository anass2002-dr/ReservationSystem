using Microsoft.EntityFrameworkCore;
using ReservationSystem_backend;

var builder = WebApplication.CreateBuilder(args);

ConfigurationManager configuration = builder.Configuration;

// Retrieve the connection string from configuration
var connectionString = configuration.GetConnectionString("defaultConnection");

// Add Database service and specify the migrations assembly
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
    b => b.MigrationsAssembly("ReservationSystem_backend")));

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

builder.Services.AddScoped<ReservationSystem_backend.Services.CountryService.ICountryService, ReservationSystem_backend.Services.CountryService.CountryService>();
builder.Services.AddScoped<ReservationSystem_backend.Repository.CountryRepo.ICountryRepo, ReservationSystem_backend.Repository.CountryRepo.CountryRepo>();

builder.Services.AddScoped<ReservationSystem_backend.Services.PilotService.IPilotService, ReservationSystem_backend.Services.PilotService.PilotService>();
builder.Services.AddScoped<ReservationSystem_backend.Repository.PilotRepo.IPilotRepo, ReservationSystem_backend.Repository.PilotRepo.PilotRepo>();

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

var app = builder.Build();
app.UseCors(MyPolicy); // Use CORS before any other middleware

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();
