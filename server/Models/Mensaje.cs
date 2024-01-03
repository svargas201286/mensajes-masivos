namespace Auth.Models
{
    public class Mensaje
    {
        public int Id { get; set; }
        public int IdUser { get; set; }
        public string Numeros { get; set; }
        public string ContenidoMensaje { get; set; }
        public DateTime FechaCreacion { get; set; }
        public int TotalDeMensajes { get; set; }
        public string NumeroEmisor { get; set; }  // Nuevo campo para el número emisor
    }
}
