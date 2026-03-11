package cup.todoList_app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record CategoriaRequestDTO(
        @NotBlank(message = "O nome da categoria é obrigatório!")
        @Size(min = 2, message = "O nome deve ter pelo menos 2 caracteres.")
        String nome
) {
}

