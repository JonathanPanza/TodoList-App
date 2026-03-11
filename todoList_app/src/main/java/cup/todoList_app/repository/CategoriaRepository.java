package cup.todoList_app.repository;

import cup.todoList_app.model.Categoria;
import cup.todoList_app.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByUsuarioId(Long usuarioId);
    Optional<Categoria> findByIdAndUsuarioId(Long id, Long usuarioId);
    boolean existsByNomeIgnoreCaseAndUsuarioId(String nome, Long usuarioId);
}
