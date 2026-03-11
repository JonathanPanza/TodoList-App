package cup.todoList_app.repository;

import cup.todoList_app.model.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TarefaRepository extends JpaRepository <Tarefa, Long> {
    List<Tarefa> findByStatus(String statusTarefa);
    List<Tarefa> findByUsuarioId(Long usuarioId);
    Optional<Tarefa> findByIdAndUsuarioId(Long id, Long usuarioId);
    List<Tarefa> findByCategoriaId(Long categoriaId);
}
