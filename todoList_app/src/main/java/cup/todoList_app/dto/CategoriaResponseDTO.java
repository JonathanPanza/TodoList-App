package cup.todoList_app.dto;

import cup.todoList_app.model.Categoria;

public record CategoriaResponseDTO(
        Long id,
        String nome
) {

    public CategoriaResponseDTO(Categoria categoria) {
        this(categoria.getId(), categoria.getNome());
    }
}