using System.ComponentModel.DataAnnotations;

namespace ReservationSystem_backend.DTOs
{
    public class LoginDto
    {
        [Required(ErrorMessage = "User Name is required")]
        public string? Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }
    }

    public class RegisterDto
    {
        [Required(ErrorMessage = "User Name is required")]
        public string? Username { get; set; }

        [EmailAddress]
        [Required(ErrorMessage = "Email is required")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }

        public string? FullName { get; set; }
    }

    public class UserDto
    {
        public string? Id { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? FullName { get; set; }
        public string? ProfileImageUrl { get; set; }
        public List<string>? Roles { get; set; }
    }
}
