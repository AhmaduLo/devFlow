import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Guide, GuideCategory } from '../models/guide.model';

@Injectable({
  providedIn: 'root'
})
export class GuideService {
  private guidesSubject = new BehaviorSubject<Guide[]>([]);
  public guides$ = this.guidesSubject.asObservable();

  constructor() {
    this.initializeGuides();
  }

  private initializeGuides(): void {
    const guides: Guide[] = [
      // BACKEND JAVA/SPRING - Section complète
      {
        id: 'backend-entites',
        title: 'Les Entités JPA',
        category: GuideCategory.BACKEND,
        icon: 'storage',
        color: '#10b981',
        order: 1,
        tags: ['JPA', 'Entity', 'Database', 'Annotations'],
        lastUpdated: new Date(),
        content: `# Les Entités JPA

## 📌 Définition

Une **entité JPA** (Java Persistence API) est une classe Java qui représente une table dans votre base de données. C'est le pont entre votre code orienté objet et vos données relationnelles.

### Rôle dans l'architecture
- **Couche Data** : Les entités font partie de la couche d'accès aux données
- **Mapping Objet-Relationnel** : Transforment les lignes de BDD en objets Java
- **Gestion automatique** : JPA/Hibernate gère la synchronisation avec la BDD

---

## 🔑 Annotations essentielles

### @Entity
Indique à JPA que cette classe est une entité persistante.

\`\`\`java
@Entity
@Table(name = "users") // Nom personnalisé de la table
public class User {
    // ...
}
\`\`\`

### @Id et @GeneratedValue
Définissent la clé primaire et sa stratégie de génération.

\`\`\`java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
\`\`\`

**Stratégies disponibles** :
- **IDENTITY** : Auto-incrémentation BDD (MySQL, PostgreSQL)
- **SEQUENCE** : Séquence BDD (Oracle, PostgreSQL)
- **AUTO** : JPA choisit selon la BDD
- **UUID** : Génère un UUID unique

### @Column
Personnalise la colonne en BDD.

\`\`\`java
@Column(
    name = "email_address",
    nullable = false,
    unique = true,
    length = 100
)
private String email;
\`\`\`

---

## 🔗 Relations entre entités

### One-to-Many / Many-to-One

\`\`\`java
// Côté "One" (User)
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(
        mappedBy = "user",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<Order> orders = new ArrayList<>();
}

// Côté "Many" (Order)
@Entity
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
\`\`\`

**💡 Bonnes pratiques** :
- Utiliser **LAZY** pour éviter de charger trop de données
- Définir **cascade** pour propager les opérations
- Utiliser **orphanRemoval** pour supprimer les enfants orphelins

### Many-to-Many

\`\`\`java
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    @JoinTable(
        name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses = new HashSet<>();
}
\`\`\`

---

## ⏰ Auditing automatique

Utilisez **@EntityListeners** pour l'auditing :

\`\`\`java
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @CreatedBy
    private String createdBy;

    @LastModifiedBy
    private String lastModifiedBy;
}
\`\`\`

N'oubliez pas d'activer l'auditing dans votre configuration :

\`\`\`java
@Configuration
@EnableJpaAuditing
public class JpaConfig {
    // ...
}
\`\`\`

---

## ❌ Erreurs courantes à éviter

### 1. Oublier equals() et hashCode()
\`\`\`java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof User)) return false;
    User user = (User) o;
    return Objects.equals(id, user.id);
}

@Override
public int hashCode() {
    return Objects.hash(id);
}
\`\`\`

### 2. Utiliser EAGER partout
❌ **Mauvais** : Charge toutes les relations
\`\`\`java
@OneToMany(fetch = FetchType.EAGER)
\`\`\`

✅ **Bon** : Charge à la demande
\`\`\`java
@OneToMany(fetch = FetchType.LAZY)
\`\`\`

### 3. Relations bidirectionnelles mal gérées
Utilisez des méthodes helper :

\`\`\`java
public void addOrder(Order order) {
    orders.add(order);
    order.setUser(this);
}

public void removeOrder(Order order) {
    orders.remove(order);
    order.setUser(null);
}
\`\`\`

---

## 📋 Checklist Entité

- [ ] Annotation @Entity présente
- [ ] @Id défini avec @GeneratedValue
- [ ] Constructeur vide (requis par JPA)
- [ ] equals() et hashCode() implémentés
- [ ] Relations avec fetch = LAZY par défaut
- [ ] Cascade approprié pour les relations
- [ ] @Column avec contraintes (nullable, unique, length)
- [ ] Auditing configuré si nécessaire
`
      },
      {
        id: 'backend-repositories',
        title: 'Les Repositories',
        category: GuideCategory.BACKEND,
        icon: 'folder_open',
        color: '#10b981',
        order: 2,
        tags: ['Repository', 'JPA', 'Query', 'CRUD'],
        lastUpdated: new Date(),
        content: `# Les Repositories

## 📌 Définition

Un **Repository** est une interface qui fournit les méthodes pour accéder aux données. Spring Data JPA génère automatiquement l'implémentation.

### Rôle dans l'architecture
- **Couche Data Access** : Abstraction de la BDD
- **CRUD automatique** : Create, Read, Update, Delete générés
- **Queries personnalisées** : Méthodes de recherche avancées

---

## 🚀 Repository de base

\`\`\`java
public interface UserRepository extends JpaRepository<User, Long> {
    // CRUD methods are automatically provided!
    // - save(User user)
    // - findById(Long id)
    // - findAll()
    // - deleteById(Long id)
    // - count()
    // - existsById(Long id)
}
\`\`\`

**Méthodes héritées** :
- \`save(T entity)\` : Crée ou met à jour
- \`findById(ID id)\` : Trouve par ID
- \`findAll()\` : Récupère tout
- \`delete(T entity)\` : Supprime
- \`count()\` : Compte les enregistrements

---

## 🔍 Query Methods (méthodes dérivées)

Spring génère automatiquement les requêtes depuis le nom de la méthode !

\`\`\`java
public interface UserRepository extends JpaRepository<User, Long> {

    // Recherche par email
    Optional<User> findByEmail(String email);

    // Vérifie si existe
    boolean existsByEmail(String email);

    // Plusieurs critères avec AND
    List<User> findByFirstNameAndLastName(String firstName, String lastName);

    // Recherche avec OR
    List<User> findByFirstNameOrLastName(String firstName, String lastName);

    // Recherche avec LIKE
    List<User> findByEmailContaining(String email);

    // Trier les résultats
    List<User> findByAgeGreaterThanOrderByLastNameAsc(int age);

    // Limiter le nombre de résultats
    List<User> findTop5ByOrderByCreatedAtDesc();

    // Compter
    long countByActive(boolean active);
}
\`\`\`

**Mots-clés disponibles** :
- \`findBy\`, \`getBy\`, \`queryBy\`, \`readBy\`
- \`And\`, \`Or\`
- \`Is\`, \`Equals\`
- \`Between\`, \`LessThan\`, \`GreaterThan\`
- \`Like\`, \`Containing\`, \`StartingWith\`, \`EndingWith\`
- \`OrderBy...Asc\`, \`OrderBy...Desc\`

---

## 💪 @Query personnalisée

Pour des requêtes complexes, utilisez @Query :

\`\`\`java
public interface UserRepository extends JpaRepository<User, Long> {

    // JPQL (Java Persistence Query Language)
    @Query("SELECT u FROM User u WHERE u.email = ?1")
    Optional<User> findUserByEmail(String email);

    // Avec paramètres nommés
    @Query("SELECT u FROM User u WHERE u.firstName = :firstName AND u.age > :age")
    List<User> findByNameAndAge(
        @Param("firstName") String firstName,
        @Param("age") int age
    );

    // Requête SQL native
    @Query(value = "SELECT * FROM users WHERE email = ?1", nativeQuery = true)
    User findByEmailNative(String email);

    // Mise à jour
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.active = :status WHERE u.id = :userId")
    int updateUserStatus(@Param("userId") Long userId, @Param("status") boolean status);

    // Projection (sélectionner seulement certains champs)
    @Query("SELECT u.firstName, u.lastName FROM User u WHERE u.id = ?1")
    Object[] findNameById(Long id);
}
\`\`\`

---

## 📊 Pagination et Tri

\`\`\`java
public interface UserRepository extends JpaRepository<User, Long> {

    // Avec Pageable
    Page<User> findByActive(boolean active, Pageable pageable);

    // Avec Sort
    List<User> findByActive(boolean active, Sort sort);
}

// Utilisation dans le Service
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Page<User> getActiveUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("lastName").ascending());
        return userRepository.findByActive(true, pageable);
    }
}
\`\`\`

---

## 🎯 Projections (DTO)

Récupérez seulement les données nécessaires :

\`\`\`java
// Interface de projection
public interface UserSummary {
    String getFirstName();
    String getLastName();
    String getEmail();
}

// Dans le Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<UserSummary> findAllProjectedBy();
    UserSummary findProjectedById(Long id);
}
\`\`\`

---

## ⚠️ Erreurs courantes

### 1. N+1 Query Problem
❌ **Problème** : Une requête par entité liée
\`\`\`java
List<User> users = userRepository.findAll();
for (User user : users) {
    user.getOrders(); // +1 requête par user !
}
\`\`\`

✅ **Solution** : Utiliser JOIN FETCH
\`\`\`java
@Query("SELECT u FROM User u LEFT JOIN FETCH u.orders")
List<User> findAllWithOrders();
\`\`\`

### 2. Oublier @Modifying pour UPDATE/DELETE
\`\`\`java
@Modifying  // ← Important !
@Transactional
@Query("DELETE FROM User u WHERE u.active = false")
void deleteInactiveUsers();
\`\`\`

### 3. Mauvaise gestion d'Optional
❌ **Mauvais**
\`\`\`java
User user = userRepository.findById(id).get(); // Exception si absent
\`\`\`

✅ **Bon**
\`\`\`java
User user = userRepository.findById(id)
    .orElseThrow(() -> new UserNotFoundException(id));
\`\`\`

---

## 📋 Checklist Repository

- [ ] Extend JpaRepository<Entity, ID>
- [ ] Noms de méthodes suivent la convention
- [ ] @Query avec JPQL ou SQL natif si besoin
- [ ] @Modifying + @Transactional pour UPDATE/DELETE
- [ ] Pagination pour les grandes listes
- [ ] JOIN FETCH pour éviter N+1
- [ ] Projections pour optimiser les performances
- [ ] Gestion correcte d'Optional
`
      },
      // Placeholder pour les autres guides (à remplir progressivement)
      {
        id: 'architecture-uml',
        title: 'Diagrammes UML',
        category: GuideCategory.ARCHITECTURE,
        icon: 'account_tree',
        color: '#667eea',
        order: 1,
        tags: ['UML', 'Diagramme', 'Conception'],
        lastUpdated: new Date(),
        content: `# Diagrammes UML

## 📌 Qu'est-ce que l'UML ?

**UML (Unified Modeling Language)** est un langage de modélisation graphique standardisé utilisé pour :
- Visualiser l'architecture d'une application
- Concevoir le système avant le développement
- Communiquer avec l'équipe et les clients
- Documenter les fonctionnalités et comportements

---

## 🎯 Types de Diagrammes UML

### 1. Diagramme de Cas d'Utilisation (Use Case)

**Objectif** : Identifier les acteurs et leurs interactions avec le système.

**Éléments clés** :
- **Acteur** : Utilisateur ou système externe
- **Cas d'utilisation** : Fonctionnalité du système
- **Relations** : Include, extend, généralisation

**Exemple : Système de gestion de bibliothèque**

\`\`\`
┌─────────────────────────────────────────────────┐
│                                                 │
│  [Étudiant]                                     │
│     │                                           │
│     ├──> (Emprunter un livre)                  │
│     │         │                                 │
│     │         └─<<include>>─> (S'authentifier) │
│     │                                           │
│     ├──> (Retourner un livre)                  │
│     │                                           │
│     └──> (Rechercher un livre)                 │
│                                                 │
│  [Bibliothécaire]                              │
│     │                                           │
│     ├──> (Ajouter un livre)                    │
│     │         │                                 │
│     │         └─<<extend>>─> (Scanner code-barres)
│     │                                           │
│     └──> (Gérer les retards)                   │
│                                                 │
└─────────────────────────────────────────────────┘
\`\`\`

**Relations** :
- **<<include>>** : Fonctionnalité obligatoire (ex: authentification)
- **<<extend>>** : Fonctionnalité optionnelle (ex: scanner)

---

### 2. Diagramme de Classes

**Objectif** : Modéliser la structure statique du système (classes, attributs, méthodes, relations).

**Éléments clés** :
- **Classe** : Nom, attributs, méthodes
- **Relations** : Association, agrégation, composition, héritage

**Exemple : Système de commerce en ligne**

\`\`\`java
┌─────────────────────────────────┐
│          User                   │
├─────────────────────────────────┤
│ - id: Long                      │
│ - email: String                 │
│ - password: String              │
│ - name: String                  │
├─────────────────────────────────┤
│ + register(): void              │
│ + login(): boolean              │
│ + updateProfile(): void         │
└─────────────────────────────────┘
           △
           │ (héritage)
           │
    ┌──────┴──────┐
    │             │
┌───────────┐ ┌───────────┐
│  Client   │ │   Admin   │
├───────────┤ ├───────────┤
│ - cart    │ │ - role    │
├───────────┤ ├───────────┤
│ + order() │ │ + manage()│
└───────────┘ └───────────┘
     │
     │ (composition) 1──*
     │
┌─────────────────────────────────┐
│          Order                  │
├─────────────────────────────────┤
│ - id: Long                      │
│ - date: Date                    │
│ - total: Double                 │
│ - status: OrderStatus           │
├─────────────────────────────────┤
│ + calculate(): Double           │
│ + cancel(): void                │
└─────────────────────────────────┘
     │
     │ (composition) 1──*
     │
┌─────────────────────────────────┐
│        OrderItem                │
├─────────────────────────────────┤
│ - quantity: int                 │
│ - price: Double                 │
├─────────────────────────────────┤
│ + getSubtotal(): Double         │
└─────────────────────────────────┘
     │
     │ (association) *──1
     │
┌─────────────────────────────────┐
│         Product                 │
├─────────────────────────────────┤
│ - id: Long                      │
│ - name: String                  │
│ - price: Double                 │
│ - stock: int                    │
├─────────────────────────────────┤
│ + updateStock(): void           │
│ + getDetails(): String          │
└─────────────────────────────────┘
\`\`\`

**Types de relations** :
- **Association (─)** : Lien simple entre classes
- **Agrégation (◇─)** : "A un" - relation faible
- **Composition (◆─)** : "Composé de" - relation forte
- **Héritage (△─)** : "Est un" - spécialisation

---

### 3. Diagramme de Séquence

**Objectif** : Montrer les interactions entre objets dans un scénario temporel.

**Exemple : Processus de connexion**

\`\`\`
Client    →    Frontend    →    Backend    →   Database
  │               │               │               │
  │  Login()      │               │               │
  ├──────────────>│               │               │
  │               │  POST /login  │               │
  │               ├──────────────>│               │
  │               │               │ findUser()    │
  │               │               ├──────────────>│
  │               │               │               │
  │               │               │  User data    │
  │               │               │<──────────────┤
  │               │               │               │
  │               │               │ validatePwd() │
  │               │               │───┐           │
  │               │               │<──┘           │
  │               │               │               │
  │               │               │ generateJWT() │
  │               │               │───┐           │
  │               │               │<──┘           │
  │               │               │               │
  │               │  200 + token  │               │
  │               │<──────────────┤               │
  │               │               │               │
  │  Success      │               │               │
  │<──────────────┤               │               │
  │               │               │               │
\`\`\`

**Éléments** :
- **Lignes de vie** : Représentent les objets (verticales)
- **Messages** : Flèches entre objets
- **Activation** : Barres rectangulaires (exécution)

---

### 4. Diagramme d'Activité

**Objectif** : Modéliser le flux de travail et les processus métier.

**Exemple : Processus de commande en ligne**

\`\`\`
    (●) Début
      │
      ▼
   [Parcourir catalogue]
      │
      ▼
   ◇ Produit trouvé ?
   ├─ Non ──> [Afficher message]─┐
   │                              │
   └─ Oui                         │
      │                           │
      ▼                           │
   [Ajouter au panier]           │
      │                           │
      ▼                           │
   ◇ Continuer shopping ?        │
   ├─ Oui ───────────────────────┘
   │
   └─ Non
      │
      ▼
   [Valider panier]
      │
      ▼
   ◇ Stock disponible ?
   ├─ Non ──> [Retirer produit]──┐
   │                              │
   └─ Oui                         │
      │                           │
      ▼                           │
   [Choisir livraison]           │
      │                           │
      ▼                           │
   [Saisir paiement]             │
      │                           │
      ▼                           │
   ◇ Paiement réussi ?           │
   ├─ Non ──> [Erreur paiement]──┤
   │                              │
   └─ Oui                         │
      │                           │
      ▼                           │
   [Confirmer commande]          │
      │                           │
      ▼                           │
   [Envoyer email]              │
      │                           │
      ▼                           │
    (◉) Fin <────────────────────┘
\`\`\`

**Symboles** :
- **(●)** : Nœud de début
- **(◉)** : Nœud de fin
- **[Action]** : Activité
- **◇** : Condition/décision
- **│** : Flux

---

### 5. Diagramme d'État

**Objectif** : Modéliser les différents états d'un objet et leurs transitions.

**Exemple : États d'une commande**

\`\`\`
    (●) Initial
      │
      │ créer()
      ▼
┌─────────────────┐
│    PENDING      │
│  (En attente)   │
└─────────────────┘
      │
      │ confirm()
      ▼
┌─────────────────┐
│   CONFIRMED     │
│  (Confirmée)    │
└─────────────────┘
      │
      │ pay()
      ▼
┌─────────────────┐
│     PAID        │────┐
│   (Payée)       │    │ ship()
└─────────────────┘    │
      │                │
      │                ▼
      │          ┌─────────────────┐
      │          │    SHIPPED      │
      │          │   (Expédiée)    │
      │          └─────────────────┘
      │                │
      │                │ deliver()
      │                ▼
      │          ┌─────────────────┐
      │          │   DELIVERED     │
      │          │   (Livrée)      │
      │          └─────────────────┘
      │                │
      │ cancel()       │ complete()
      ▼                ▼
┌─────────────────┐  (◉)
│   CANCELLED     │
│   (Annulée)     │
└─────────────────┘
      │
      ▼
    (◉) Final
\`\`\`

---

## 🛠️ Outils de Modélisation UML

### Outils recommandés

**1. PlantUML**
- Génère des diagrammes à partir de texte
- Intégration avec VS Code, IntelliJ
- Format : fichiers .puml

\`\`\`plantuml
@startuml
actor User
User -> System : Login
System -> Database : Verify credentials
Database -> System : User data
System -> User : Success
@enduml
\`\`\`

**2. Draw.io (diagrams.net)**
- Gratuit et en ligne
- Interface glisser-déposer
- Export en PNG, SVG, PDF

**3. Lucidchart**
- Collaboration en temps réel
- Templates UML prêts à l'emploi
- Version gratuite limitée

**4. StarUML**
- Application desktop professionnelle
- Support complet UML 2.0
- Version gratuite avec limitations

---

## ✅ Bonnes Pratiques

### 1. Commencer simple
- Ne pas tout modéliser dès le début
- Focus sur les éléments critiques
- Itérer progressivement

### 2. Nommer correctement
- Classes : PascalCase (User, OrderItem)
- Attributs/Méthodes : camelCase (firstName, calculateTotal)
- Éviter les noms génériques

### 3. Respecter les principes SOLID
- **S**ingle Responsibility
- **O**pen/Closed
- **L**iskov Substitution
- **I**nterface Segregation
- **D**ependency Inversion

### 4. Documentation
- Ajouter des notes explicatives
- Documenter les choix de conception
- Maintenir les diagrammes à jour

---

## 🎯 Exemple Complet : Application de Blog

### Diagramme de Classes

\`\`\`java
┌─────────────────────────────────┐
│            User                 │
├─────────────────────────────────┤
│ - id: Long                      │
│ - username: String              │
│ - email: String                 │
│ - role: UserRole                │
├─────────────────────────────────┤
│ + authenticate(): boolean       │
│ + hasPermission(): boolean      │
└─────────────────────────────────┘
     │
     │ 1──* (author)
     │
┌─────────────────────────────────┐
│           Article               │
├─────────────────────────────────┤
│ - id: Long                      │
│ - title: String                 │
│ - content: String               │
│ - publishDate: Date             │
│ - status: ArticleStatus         │
├─────────────────────────────────┤
│ + publish(): void               │
│ + update(): void                │
│ + delete(): void                │
└─────────────────────────────────┘
     │
     │ 1──*
     │
┌─────────────────────────────────┐
│          Comment                │
├─────────────────────────────────┤
│ - id: Long                      │
│ - content: String               │
│ - createdAt: Date               │
├─────────────────────────────────┤
│ + create(): void                │
│ + moderate(): void              │
└─────────────────────────────────┘
\`\`\`

---

## 📚 Ressources Complémentaires

- [Spécification UML officielle](https://www.omg.org/spec/UML/)
- [PlantUML Documentation](https://plantuml.com/)
- Livre : "UML pour les développeurs" - Pascal Roques
- Tutoriel : [Visual Paradigm UML Guide](https://www.visual-paradigm.com/guide/uml/)

**💡 Conseil** : Utilisez UML comme outil de communication, pas comme documentation exhaustive. L'objectif est de clarifier, pas de compliquer !
`
      },

      // ENVIRONNEMENT DE DÉVELOPPEMENT - Section complète
      {
        id: 'env-git-basics',
        title: 'Git - Les Bases',
        category: GuideCategory.ENVIRONMENT,
        icon: 'source',
        color: '#f59e0b',
        order: 1,
        tags: ['Git', 'Version Control', 'Commandes'],
        lastUpdated: new Date(),
        content: `# Git - Les Bases

## 📌 Qu'est-ce que Git ?

**Git** est un système de contrôle de version distribué qui permet de :
- Suivre l'historique des modifications du code
- Collaborer avec d'autres développeurs
- Revenir en arrière en cas d'erreur
- Gérer plusieurs versions d'un projet

---

## 🚀 Installation et Configuration

### Installation
\`\`\`bash
# Windows (avec Chocolatey)
choco install git

# macOS (avec Homebrew)
brew install git

# Linux (Debian/Ubuntu)
sudo apt-get install git
\`\`\`

### Configuration initiale
\`\`\`bash
# Configurer votre identité
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Vérifier la configuration
git config --list

# Éditeur par défaut
git config --global core.editor "code --wait"
\`\`\`

---

## 📦 Commandes Essentielles

### Initialiser un dépôt
\`\`\`bash
# Créer un nouveau dépôt Git
git init

# Cloner un dépôt existant
git clone https://github.com/username/repo.git
\`\`\`

### Workflow de base
\`\`\`bash
# Voir l'état des fichiers
git status

# Ajouter des fichiers à la staging area
git add fichier.txt          # Un fichier spécifique
git add .                    # Tous les fichiers modifiés
git add *.js                 # Tous les fichiers .js

# Créer un commit
git commit -m "Message descriptif du commit"

# Voir l'historique
git log
git log --oneline           # Format condensé
git log --graph --oneline   # Avec graphique
\`\`\`

---

## 🌿 Branches

### Pourquoi utiliser des branches ?
- Développer des fonctionnalités isolées
- Tester sans affecter le code principal
- Collaborer sans conflits

### Commandes de branches
\`\`\`bash
# Créer une nouvelle branche
git branch nom-branche

# Changer de branche
git checkout nom-branche

# Créer et changer de branche en une commande
git checkout -b nouvelle-branche

# Lister les branches
git branch              # Branches locales
git branch -a           # Toutes les branches

# Supprimer une branche
git branch -d nom-branche     # Suppression sécurisée
git branch -D nom-branche     # Force la suppression
\`\`\`

---

## 🔄 Synchronisation avec un dépôt distant

### Configuration du remote
\`\`\`bash
# Ajouter un remote
git remote add origin https://github.com/username/repo.git

# Voir les remotes
git remote -v

# Changer l'URL d'un remote
git remote set-url origin nouvelle-url
\`\`\`

### Push et Pull
\`\`\`bash
# Envoyer vos commits vers le remote
git push origin main

# Récupérer les modifications du remote
git pull origin main

# Push d'une nouvelle branche
git push -u origin ma-branche
\`\`\`

---

## ⚡ Commandes Utiles

### Annuler des modifications
\`\`\`bash
# Annuler les modifications non committées d'un fichier
git checkout -- fichier.txt

# Retirer un fichier de la staging area
git reset HEAD fichier.txt

# Annuler le dernier commit (garde les modifications)
git reset --soft HEAD~1

# Annuler le dernier commit (supprime les modifications)
git reset --hard HEAD~1
\`\`\`

### Stash (mettre de côté temporairement)
\`\`\`bash
# Sauvegarder les modifications en cours
git stash

# Voir la liste des stash
git stash list

# Réappliquer le dernier stash
git stash apply

# Réappliquer et supprimer le stash
git stash pop
\`\`\`

---

## 🔀 Merge et Rebase

### Fusionner une branche
\`\`\`bash
# Se placer sur la branche cible
git checkout main

# Fusionner la branche feature
git merge feature-branch
\`\`\`

### Rebase (réorganiser l'historique)
\`\`\`bash
# Rebaser sur main
git checkout feature-branch
git rebase main
\`\`\`

---

## 📋 Fichier .gitignore

Créez un fichier \`.gitignore\` pour exclure certains fichiers :

\`\`\`text
# Dépendances
node_modules/
vendor/

# Fichiers de build
dist/
build/
target/

# IDE
.vscode/
.idea/
*.swp

# Environnement
.env
.env.local

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
\`\`\`

---

## ❌ Erreurs Courantes

### 1. Commit sur la mauvaise branche
\`\`\`bash
# Annuler le commit et le replacer sur une autre branche
git reset HEAD~1
git stash
git checkout bonne-branche
git stash pop
git add .
git commit -m "Message"
\`\`\`

### 2. Résoudre les conflits de merge
\`\`\`bash
# Après un git pull ou merge avec conflit
# 1. Ouvrir les fichiers en conflit
# 2. Chercher les marqueurs <<<<<<< ======= >>>>>>>
# 3. Résoudre manuellement
# 4. Ajouter et committer
git add fichier-resolu.txt
git commit -m "Résolution du conflit"
\`\`\`

### 3. Message de commit mal écrit
\`\`\`bash
# Modifier le dernier message de commit
git commit --amend -m "Nouveau message"
\`\`\`

---

## 📋 Bonnes Pratiques

### Messages de commit
✅ **Bon** : "feat: ajout de l'authentification JWT"
❌ **Mauvais** : "fix stuff"

### Convention
- \`feat:\` Nouvelle fonctionnalité
- \`fix:\` Correction de bug
- \`docs:\` Documentation
- \`style:\` Formatage
- \`refactor:\` Refactorisation
- \`test:\` Ajout de tests
- \`chore:\` Tâches diverses

### Workflow recommandé
1. Créer une branche pour chaque feature
2. Faire des commits atomiques (une modification = un commit)
3. Écrire des messages descriptifs
4. Pull avant de push
5. Merger régulièrement main dans votre branche

---

## 📋 Checklist Git

- [ ] Git installé et configuré (name, email)
- [ ] Dépôt initialisé ou cloné
- [ ] .gitignore créé
- [ ] Comprendre add, commit, push, pull
- [ ] Savoir créer et changer de branche
- [ ] Savoir résoudre un conflit basique
- [ ] Utiliser des messages de commit clairs
- [ ] Remote origin configuré
`
      },
      {
        id: 'env-spring-boot-setup',
        title: 'Configuration Spring Boot',
        category: GuideCategory.ENVIRONMENT,
        icon: 'settings_applications',
        color: '#f59e0b',
        order: 2,
        tags: ['Spring Boot', 'Java', 'Maven', 'Configuration'],
        lastUpdated: new Date(),
        content: `# Configuration Spring Boot

## 📌 Qu'est-ce que Spring Boot ?

**Spring Boot** est un framework qui simplifie la création d'applications Java basées sur Spring. Il offre :
- Configuration automatique
- Serveur embarqué (Tomcat, Jetty)
- Démarrage rapide
- Gestion des dépendances simplifiée

---

## 🚀 Prérequis

### Logiciels nécessaires
- **JDK 17 ou supérieur**
- **Maven 3.6+** ou **Gradle 7+**
- **IDE** : IntelliJ IDEA, Eclipse, ou VS Code

### Vérifier l'installation Java
\`\`\`bash
java -version
# Devrait afficher : openjdk version "17.0.x" ou supérieur

javac -version
# Devrait afficher : javac 17.0.x
\`\`\`

### Installer Maven
\`\`\`bash
# Windows (avec Chocolatey)
choco install maven

# macOS (avec Homebrew)
brew install maven

# Linux
sudo apt-get install maven

# Vérifier
mvn -version
\`\`\`

---

## 🏗️ Créer un Projet Spring Boot

### Méthode 1 : Spring Initializr (Recommandé)

1. Aller sur [https://start.spring.io](https://start.spring.io)
2. Configurer le projet :
   - **Project** : Maven
   - **Language** : Java
   - **Spring Boot** : 3.2.x (dernière stable)
   - **Group** : com.example
   - **Artifact** : demo
   - **Packaging** : Jar
   - **Java** : 17

3. Ajouter les dépendances :
   - Spring Web
   - Spring Data JPA
   - MySQL Driver (ou PostgreSQL)
   - Spring Boot DevTools
   - Lombok

4. Cliquer sur "Generate" et décompresser le ZIP

### Méthode 2 : Ligne de commande
\`\`\`bash
curl https://start.spring.io/starter.zip \\
  -d dependencies=web,data-jpa,mysql,devtools,lombok \\
  -d type=maven-project \\
  -d language=java \\
  -d bootVersion=3.2.0 \\
  -d baseDir=mon-projet \\
  -d groupId=com.example \\
  -d artifactId=demo \\
  -o mon-projet.zip

unzip mon-projet.zip
cd mon-projet
\`\`\`

---

## 📁 Structure du Projet

\`\`\`
mon-projet/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/demo/
│   │   │       ├── DemoApplication.java       # Point d'entrée
│   │   │       ├── controller/                # Contrôleurs REST
│   │   │       ├── service/                   # Logique métier
│   │   │       ├── repository/                # Accès aux données
│   │   │       ├── model/                     # Entités JPA
│   │   │       └── dto/                       # Data Transfer Objects
│   │   └── resources/
│   │       ├── application.properties         # Configuration
│   │       ├── static/                        # Fichiers statiques
│   │       └── templates/                     # Templates (si Thymeleaf)
│   └── test/
│       └── java/                              # Tests unitaires
├── pom.xml                                    # Configuration Maven
└── README.md
\`\`\`

---

## ⚙️ Configuration application.properties

### Configuration de base
\`\`\`properties
# Nom de l'application
spring.application.name=demo

# Port du serveur
server.port=8080

# Contexte de l'application
server.servlet.context-path=/api
\`\`\`

### Base de données MySQL
\`\`\`properties
# URL de connexion
spring.datasource.url=jdbc:mysql://localhost:3306/demo_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root

# Driver
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
\`\`\`

### Base de données PostgreSQL
\`\`\`properties
spring.datasource.url=jdbc:postgresql://localhost:5432/demo_db
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
\`\`\`

### Profils d'environnement
\`\`\`properties
# application.properties
spring.profiles.active=dev

# application-dev.properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/demo_dev

# application-prod.properties
server.port=80
spring.datasource.url=jdbc:mysql://prod-server:3306/demo_prod
\`\`\`

---

## 🔧 Configuration avec YAML (Alternative)

Créez \`application.yml\` au lieu de \`application.properties\` :

\`\`\`yaml
spring:
  application:
    name: demo
  datasource:
    url: jdbc:mysql://localhost:3306/demo_db
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.MySQLDialect

server:
  port: 8080
  servlet:
    context-path: /api
\`\`\`

---

## 🚀 Lancer l'Application

### Avec Maven
\`\`\`bash
# Compiler le projet
mvn clean install

# Lancer l'application
mvn spring-boot:run

# Créer un JAR exécutable
mvn package
java -jar target/demo-0.0.1-SNAPSHOT.jar
\`\`\`

### Depuis l'IDE
- **IntelliJ IDEA** : Clic droit sur \`DemoApplication.java\` → Run
- **Eclipse** : Clic droit sur le projet → Run As → Spring Boot App
- **VS Code** : Ouvrir \`DemoApplication.java\` → Run

---

## 📦 Dépendances Courantes (pom.xml)

### Spring Web (API REST)
\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
\`\`\`

### Spring Data JPA
\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
\`\`\`

### MySQL Driver
\`\`\`xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
\`\`\`

### Lombok (Réduire le boilerplate)
\`\`\`xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
\`\`\`

### Validation
\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
\`\`\`

### Spring Security
\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
\`\`\`

---

## 🐛 DevTools (Hot Reload)

Spring Boot DevTools permet de recharger automatiquement l'application lors des modifications.

\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
\`\`\`

**Configuration IDE** :
- **IntelliJ IDEA** : Settings → Build → Compiler → Build project automatically
- **Eclipse** : Activé par défaut

---

## 🔍 Actuator (Monitoring)

Actuator expose des endpoints pour monitorer l'application.

\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
\`\`\`

\`\`\`properties
# application.properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
\`\`\`

**Endpoints disponibles** :
- \`/actuator/health\` : État de santé
- \`/actuator/info\` : Informations sur l'app
- \`/actuator/metrics\` : Métriques

---

## ❌ Problèmes Courants

### 1. Port déjà utilisé
\`\`\`
Web server failed to start. Port 8080 was already in use.
\`\`\`

**Solution** : Changer le port dans \`application.properties\`
\`\`\`properties
server.port=8081
\`\`\`

### 2. Erreur de connexion à la BDD
\`\`\`
Unable to create initial connections of pool
\`\`\`

**Solutions** :
- Vérifier que MySQL/PostgreSQL est démarré
- Vérifier les credentials (username, password)
- Vérifier que la BDD existe : \`CREATE DATABASE demo_db;\`

### 3. Classe principale non trouvée
**Solution** : Vérifier que \`@SpringBootApplication\` est présent sur la classe principale

---

## 📋 Checklist Configuration

- [ ] JDK 17+ installé
- [ ] Maven installé
- [ ] Projet créé via Spring Initializr
- [ ] Structure de projet correcte
- [ ] application.properties configuré
- [ ] Base de données installée et accessible
- [ ] Application démarre sans erreur
- [ ] DevTools activé pour hot reload
- [ ] Actuator configuré (optionnel)
- [ ] Tests de base passent

---

## 🎯 Prochaines Étapes

1. Créer votre première entité JPA
2. Créer un Repository
3. Créer un Service
4. Créer un Controller REST
5. Tester avec Postman
`
      },
      {
        id: 'env-angular-setup',
        title: 'Configuration Angular',
        category: GuideCategory.ENVIRONMENT,
        icon: 'web',
        color: '#f59e0b',
        order: 3,
        tags: ['Angular', 'Node.js', 'npm', 'CLI'],
        lastUpdated: new Date(),
        content: `# Configuration Angular

## 📌 Qu'est-ce qu'Angular ?

**Angular** est un framework TypeScript développé par Google pour créer des applications web modernes. Il offre :
- Architecture basée sur les composants
- Two-way data binding
- Injection de dépendances
- Routing intégré
- TypeScript par défaut

---

## 🚀 Prérequis

### Installer Node.js et npm

**Node.js** inclut npm (Node Package Manager).

\`\`\`bash
# Vérifier si déjà installé
node -v    # Doit être >= 18.x
npm -v     # Doit être >= 9.x

# Télécharger depuis https://nodejs.org
# Choisir la version LTS (Long Term Support)
\`\`\`

**Windows** : Télécharger l'installeur .msi
**macOS** : \`brew install node\`
**Linux** :
\`\`\`bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
\`\`\`

---

## 🔧 Installer Angular CLI

Angular CLI est l'outil en ligne de commande pour Angular.

\`\`\`bash
# Installation globale
npm install -g @angular/cli

# Vérifier l'installation
ng version

# Mettre à jour Angular CLI
npm uninstall -g @angular/cli
npm install -g @angular/cli@latest
\`\`\`

---

## 🏗️ Créer un Nouveau Projet

### Création de base
\`\`\`bash
# Créer un nouveau projet
ng new mon-app

# Répondre aux questions :
# ? Would you like to add Angular routing? Yes
# ? Which stylesheet format would you like to use? SCSS

# Naviguer dans le projet
cd mon-app

# Lancer le serveur de développement
ng serve

# Ouvrir http://localhost:4200
\`\`\`

### Options de création
\`\`\`bash
# Projet avec routing et SCSS
ng new mon-app --routing --style=scss

# Sans tests
ng new mon-app --skip-tests

# Mode strict désactivé
ng new mon-app --strict=false

# Avec un prefix personnalisé
ng new mon-app --prefix=app
\`\`\`

---

## 📁 Structure du Projet

\`\`\`
mon-app/
├── src/
│   ├── app/
│   │   ├── app.component.ts         # Composant racine
│   │   ├── app.component.html       # Template
│   │   ├── app.component.scss       # Styles
│   │   ├── app.component.spec.ts    # Tests
│   │   ├── app.routes.ts            # Configuration du routing
│   │   └── app.config.ts            # Configuration de l'app
│   ├── assets/                      # Images, fonts, etc.
│   ├── environments/                # Variables d'environnement
│   ├── index.html                   # Page HTML principale
│   ├── main.ts                      # Point d'entrée
│   └── styles.scss                  # Styles globaux
├── angular.json                     # Configuration Angular CLI
├── package.json                     # Dépendances npm
├── tsconfig.json                    # Configuration TypeScript
└── README.md
\`\`\`

---

## 🎨 Générer des Composants et Services

### Composants
\`\`\`bash
# Générer un composant
ng generate component components/home
# ou raccourci
ng g c components/home

# Composant sans fichier de test
ng g c components/about --skip-tests

# Composant standalone (Angular 14+)
ng g c components/header --standalone
\`\`\`

### Services
\`\`\`bash
# Générer un service
ng generate service services/user
# ou raccourci
ng g s services/user

# Avec un dossier spécifique
ng g s services/auth/auth
\`\`\`

### Autres générateurs
\`\`\`bash
# Module
ng g module modules/shared

# Directive
ng g directive directives/highlight

# Pipe
ng g pipe pipes/currency

# Guard
ng g guard guards/auth

# Interface
ng g interface models/user

# Enum
ng g enum enums/role
\`\`\`

---

## ⚙️ Configuration

### angular.json
Configuration du projet Angular CLI.

\`\`\`json
{
  "projects": {
    "mon-app": {
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/mon-app",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.scss"],
            "scripts": []
          }
        }
      }
    }
  }
}
\`\`\`

### tsconfig.json
Configuration TypeScript.

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022", "dom"],
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "paths": {
      "@app/*": ["src/app/*"],
      "@env/*": ["src/environments/*"]
    }
  }
}
\`\`\`

### Alias de chemins
Utiliser \`@app\` au lieu de chemins relatifs :

\`\`\`typescript
// Avant
import { UserService } from '../../../services/user.service';

// Après (avec paths configuré)
import { UserService } from '@app/services/user.service';
\`\`\`

---

## 🌍 Environnements

### Fichiers d'environnement
\`\`\`typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.monapp.com'
};
\`\`\`

### Utilisation
\`\`\`typescript
import { environment } from '@env/environment';

constructor(private http: HttpClient) {
  this.apiUrl = environment.apiUrl;
}
\`\`\`

### Build avec environnement
\`\`\`bash
# Build de développement
ng build

# Build de production
ng build --configuration production
\`\`\`

---

## 📦 Installer des Dépendances

### Angular Material
\`\`\`bash
ng add @angular/material

# Choisir un thème prédéfini
# Activer les animations
# Activer les gestes (HammerJS)
\`\`\`

### Bootstrap
\`\`\`bash
npm install bootstrap

# Ajouter dans angular.json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.scss"
]
\`\`\`

### HttpClient
\`\`\`typescript
// app.config.ts
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient()
  ]
};
\`\`\`

### Autres bibliothèques utiles
\`\`\`bash
# Chart.js pour les graphiques
npm install chart.js ng2-charts

# NgRx pour le state management
ng add @ngrx/store

# Leaflet pour les cartes
npm install leaflet @types/leaflet
\`\`\`

---

## 🚀 Commandes Angular CLI

### Développement
\`\`\`bash
# Lancer le serveur de dev
ng serve

# Port personnalisé
ng serve --port 4300

# Ouvrir automatiquement le navigateur
ng serve --open

# Mode production
ng serve --configuration production
\`\`\`

### Build
\`\`\`bash
# Build de développement
ng build

# Build de production (optimisé)
ng build --configuration production

# Analyser la taille du bundle
ng build --stats-json
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/mon-app/stats.json
\`\`\`

### Tests
\`\`\`bash
# Tests unitaires (Karma)
ng test

# Tests e2e (Cypress/Playwright)
ng e2e

# Coverage
ng test --code-coverage
\`\`\`

### Linting
\`\`\`bash
# Installer ESLint
ng add @angular-eslint/schematics

# Lancer le linter
ng lint

# Corriger automatiquement
ng lint --fix
\`\`\`

---

## 🐛 DevTools et Extensions

### Angular DevTools
Extension Chrome/Firefox pour déboguer Angular.

**Installation** :
- Chrome : [Angular DevTools](https://chrome.google.com/webstore/detail/angular-devtools)
- Firefox : [Angular DevTools](https://addons.mozilla.org/firefox/addon/angular-devtools/)

**Fonctionnalités** :
- Inspecter la structure des composants
- Voir les propriétés et les états
- Profiler les performances

### Extensions VS Code
- **Angular Language Service** : Autocomplétion et vérification
- **Angular Snippets** : Snippets de code
- **Prettier** : Formatage du code
- **ESLint** : Linting TypeScript

---

## ❌ Problèmes Courants

### 1. Erreur "ng: command not found"
\`\`\`bash
# Angular CLI non installé globalement
npm install -g @angular/cli

# Vérifier le PATH
echo $PATH  # macOS/Linux
echo %PATH% # Windows
\`\`\`

### 2. Port 4200 déjà utilisé
\`\`\`bash
# Utiliser un autre port
ng serve --port 4300

# Ou tuer le processus sur le port 4200
# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:4200 | xargs kill -9
\`\`\`

### 3. Erreurs de compilation TypeScript
\`\`\`bash
# Nettoyer le cache npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Mettre à jour TypeScript
npm install typescript@latest
\`\`\`

### 4. Module non trouvé
\`\`\`bash
# Réinstaller les dépendances
npm install
\`\`\`

---

## 📋 Checklist Configuration

- [ ] Node.js >= 18.x installé
- [ ] Angular CLI installé globalement
- [ ] Projet créé avec routing et SCSS
- [ ] Structure de dossiers organisée
- [ ] HttpClient configuré
- [ ] Environnements dev/prod configurés
- [ ] Application démarre sur localhost:4200
- [ ] Angular DevTools installé
- [ ] Extensions VS Code installées
- [ ] ESLint configuré

---

## 🎯 Prochaines Étapes

1. Créer vos premiers composants
2. Configurer le routing
3. Créer des services pour l'API
4. Implémenter l'authentification
5. Ajouter Angular Material ou Bootstrap
`
      },
      {
        id: 'env-ide-setup',
        title: 'Configuration de l\'IDE',
        category: GuideCategory.ENVIRONMENT,
        icon: 'code',
        color: '#f59e0b',
        order: 4,
        tags: ['IDE', 'VS Code', 'IntelliJ', 'Productivité'],
        lastUpdated: new Date(),
        content: `# Configuration de l'IDE

## 📌 Choix de l'IDE

### Pour le Backend Java/Spring
- **IntelliJ IDEA** (Recommandé) - Ultimate ou Community
- **Eclipse** - Gratuit
- **VS Code** - Léger avec extensions Java

### Pour le Frontend Angular
- **VS Code** (Recommandé) - Léger et puissant
- **WebStorm** - IDE JetBrains dédié
- **IntelliJ IDEA Ultimate** - Support TypeScript intégré

---

## 🔵 Visual Studio Code (Frontend)

### Installation
Télécharger depuis [https://code.visualstudio.com](https://code.visualstudio.com)

### Extensions Essentielles Angular

#### 1. Angular Language Service
\`\`\`
Name: Angular Language Service
ID: Angular.ng-template
\`\`\`
- Autocomplétion dans les templates
- Vérification des erreurs en temps réel
- Navigation vers les définitions

#### 2. Angular Snippets
\`\`\`
Name: Angular Snippets
ID: johnpapa.Angular2
\`\`\`
Snippets utiles :
- \`a-component\` → Créer un composant
- \`a-service\` → Créer un service
- \`a-http-get\` → Requête HTTP GET

#### 3. Prettier
\`\`\`
Name: Prettier - Code formatter
ID: esbenp.prettier-vscode
\`\`\`
Configuration (\`.prettierrc\`) :
\`\`\`json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
\`\`\`

#### 4. ESLint
\`\`\`
Name: ESLint
ID: dbaeumer.vscode-eslint
\`\`\`

#### 5. Auto Close Tag / Auto Rename Tag
\`\`\`
Name: Auto Close Tag
ID: formulahendry.auto-close-tag

Name: Auto Rename Tag
ID: formulahendry.auto-rename-tag
\`\`\`

#### 6. Path Intellisense
\`\`\`
Name: Path Intellisense
ID: christian-kohler.path-intellisense
\`\`\`

### Configuration VS Code (settings.json)

\`\`\`json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.autoSave": "onFocusChange",
  "emmet.includeLanguages": {
    "typescript": "html"
  },
  "typescript.updateImportsOnFileMove.enabled": "always",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
\`\`\`

### Raccourcis Clavier Utiles

| Raccourci | Action |
|-----------|--------|
| \`Ctrl+Shift+P\` | Palette de commandes |
| \`Ctrl+P\` | Rechercher un fichier |
| \`Ctrl+\`\` | Ouvrir le terminal |
| \`Alt+Shift+F\` | Formater le document |
| \`Ctrl+Space\` | Autocomplétion |
| \`F12\` | Aller à la définition |
| \`Shift+F12\` | Trouver toutes les références |
| \`Ctrl+/\` | Commenter/Décommenter |

---

## 🔴 IntelliJ IDEA (Backend)

### Installation
- **Community Edition** : Gratuit, Java/Kotlin
- **Ultimate Edition** : Payant, support Spring, Web, DB

Télécharger depuis [https://www.jetbrains.com/idea](https://www.jetbrains.com/idea)

### Plugins Essentiels Spring Boot

#### 1. Spring Boot (Intégré dans Ultimate)
- Auto-configuration
- Recherche de beans
- application.properties avec autocomplétion

#### 2. Lombok
\`\`\`
File → Settings → Plugins → Rechercher "Lombok"
\`\`\`
- Activer l'annotation processing :
  \`Settings → Build → Compiler → Annotation Processors\`
  ✅ Enable annotation processing

#### 3. JPA Buddy (Recommandé)
- Génération d'entités visuellement
- Aide pour les relations JPA
- Génération de repositories

#### 4. Database Tools (Intégré)
- Connexion aux bases de données
- Explorateur de tables
- Exécution de requêtes SQL

#### 5. GitToolBox
- Informations Git enrichies
- Blame inline
- Auto-fetch

### Configuration IntelliJ

#### Formater le code automatiquement
\`\`\`
Settings → Editor → Code Style → Java
→ Scheme: GoogleStyle ou créer votre style
\`\`\`

Activer le formatage automatique :
\`\`\`
Settings → Tools → Actions on Save
✅ Reformat code
✅ Optimize imports
\`\`\`

#### Configuration Maven
\`\`\`
Settings → Build → Build Tools → Maven
→ Maven home path: /usr/local/Cellar/maven/...
✅ Work offline (si pas besoin d'Internet)
\`\`\`

#### Live Templates (Snippets)
\`\`\`
Settings → Editor → Live Templates
\`\`\`

Exemples utiles :
- \`psvm\` → \`public static void main\`
- \`sout\` → \`System.out.println()\`
- \`fori\` → Boucle for avec index

### Raccourcis Clavier Utiles

| Raccourci | Action |
|-----------|--------|
| \`Double Shift\` | Rechercher partout |
| \`Ctrl+N\` | Rechercher une classe |
| \`Ctrl+Shift+N\` | Rechercher un fichier |
| \`Ctrl+Alt+L\` | Formater le code |
| \`Ctrl+Space\` | Autocomplétion basique |
| \`Ctrl+Shift+Space\` | Autocomplétion intelligente |
| \`Alt+Enter\` | Quick fix |
| \`Ctrl+Alt+Shift+T\` | Refactor |
| \`Shift+F6\` | Renommer |

---

## 🗄️ Configuration Base de Données

### MySQL Workbench
- Interface graphique pour MySQL
- Modélisation de schémas
- Exécution de requêtes

Télécharger : [https://dev.mysql.com/downloads/workbench](https://dev.mysql.com/downloads/workbench)

### DBeaver (Multiplateforme)
- Support MySQL, PostgreSQL, MongoDB, etc.
- Gratuit et open-source
- Visualisation des données

Télécharger : [https://dbeaver.io](https://dbeaver.io)

### Connexion depuis IntelliJ IDEA

1. \`View → Tool Windows → Database\`
2. Cliquer sur \`+\` → Data Source → MySQL
3. Configurer :
   - Host: localhost
   - Port: 3306
   - Database: demo_db
   - User: root
   - Password: root
4. Test Connection → OK

---

## 🧰 Outils de Productivité

### Postman / Insomnia
Tester les API REST.

Télécharger : [https://www.postman.com](https://www.postman.com)

**Alternative** : Thunder Client (extension VS Code)

### Git Client
- **GitKraken** : Interface graphique élégante
- **SourceTree** : Client Git gratuit
- **GitHub Desktop** : Simple et efficace

### Terminal Amélioré
- **Windows Terminal** (Windows 11) : Multi-onglets, customisable
- **iTerm2** (macOS) : Terminal puissant
- **Oh My Zsh** (macOS/Linux) : Shell amélioré

---

## 🎨 Thèmes Recommandés

### VS Code
- **One Dark Pro**
- **Dracula Official**
- **Material Theme**
- **Nord**

Installation :
\`\`\`
Ctrl+Shift+P → Preferences: Color Theme
\`\`\`

### IntelliJ IDEA
- **Material Theme UI**
- **One Dark Theme**
- **Dracula Theme**

Installation :
\`\`\`
Settings → Plugins → Rechercher "Material Theme UI"
\`\`\`

---

## 📋 Checklist IDE

### Frontend (VS Code)
- [ ] VS Code installé
- [ ] Angular Language Service
- [ ] Prettier + ESLint configurés
- [ ] Auto Close Tag / Auto Rename Tag
- [ ] Path Intellisense
- [ ] settings.json configuré
- [ ] Thème installé

### Backend (IntelliJ IDEA)
- [ ] IntelliJ IDEA installé
- [ ] Plugin Lombok activé
- [ ] Annotation Processing activé
- [ ] Database Tools configuré
- [ ] Maven configuré
- [ ] Formater automatiquement activé
- [ ] JPA Buddy installé (optionnel)

### Outils
- [ ] Git installé et configuré
- [ ] MySQL Workbench ou DBeaver
- [ ] Postman installé
- [ ] Terminal amélioré (optionnel)

---

## 🚀 Prochaines Étapes

1. Personnaliser votre environnement
2. Apprendre les raccourcis clavier essentiels
3. Configurer les snippets personnalisés
4. Installer les extensions selon vos besoins
5. Tester votre setup avec un projet simple
`
      },

      // FRONTEND ANGULAR - Section complète
      {
        id: 'frontend-components',
        title: 'Les Composants Angular',
        category: GuideCategory.FRONTEND,
        icon: 'widgets',
        color: '#3b82f6',
        order: 1,
        tags: ['Components', 'TypeScript', 'Templates', 'Lifecycle'],
        lastUpdated: new Date(),
        content: `# Les Composants Angular

## 📌 Qu'est-ce qu'un Composant ?

Un **composant** est la brique de base d'une application Angular. Il contrôle une partie de l'écran (une vue) et définit :
- **Le template (HTML)** : Structure visuelle
- **La classe (TypeScript)** : Logique et données
- **Les styles (CSS/SCSS)** : Apparence

---

## 🏗️ Créer un Composant

### Avec Angular CLI (Recommandé)
\`\`\`bash
# Générer un composant
ng generate component components/user-profile
# ou raccourci
ng g c components/user-profile

# Composant standalone (Angular 14+)
ng g c components/header --standalone

# Sans fichier de test
ng g c components/footer --skip-tests
\`\`\`

### Structure générée
\`\`\`
user-profile/
├── user-profile.component.ts      # Classe TypeScript
├── user-profile.component.html    # Template HTML
├── user-profile.component.scss    # Styles
└── user-profile.component.spec.ts # Tests
\`\`\`

---

## 📝 Anatomie d'un Composant

### Classe TypeScript
\`\`\`typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',        // Balise HTML
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true                     // Standalone (optionnel)
})
export class UserProfileComponent {
  // Propriétés
  userName: string = 'John Doe';
  age: number = 30;
  isActive: boolean = true;

  // Méthodes
  greet(): void {
    console.log(\`Hello, \${this.userName}!\`);
  }
}
\`\`\`

### Template HTML
\`\`\`html
<div class="user-profile">
  <h2>{{ userName }}</h2>
  <p>Age: {{ age }}</p>
  <p *ngIf="isActive">Status: Active</p>
  <button (click)="greet()">Say Hello</button>
</div>
\`\`\`

### Styles SCSS
\`\`\`scss
.user-profile {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;

  h2 {
    color: #333;
    margin-bottom: 10px;
  }

  button {
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #0056b3;
    }
  }
}
\`\`\`

---

## 🔄 Cycle de Vie des Composants

Angular appelle des hooks à différents moments du cycle de vie :

### ngOnInit (Le plus utilisé)
Initialisation du composant après le constructeur.
\`\`\`typescript
import { Component, OnInit } from '@angular/core';

export class UserProfileComponent implements OnInit {
  ngOnInit(): void {
    // Appels API, initialisation des données
    this.loadUserData();
  }

  loadUserData(): void {
    // Charger les données utilisateur
  }
}
\`\`\`

### Hooks principaux
\`\`\`typescript
export class MyComponent implements OnInit, OnDestroy, OnChanges {
  // 1. Constructeur
  constructor() {
    console.log('Constructor called');
  }

  // 2. Détection des changements d'input
  ngOnChanges(changes: SimpleChanges): void {
    console.log('Input changed:', changes);
  }

  // 3. Initialisation
  ngOnInit(): void {
    console.log('Component initialized');
  }

  // 4. Après affichage de la vue
  ngAfterViewInit(): void {
    console.log('View initialized');
  }

  // 5. Avant destruction
  ngOnDestroy(): void {
    console.log('Component destroyed');
    // Nettoyer les subscriptions
  }
}
\`\`\`

**Ordre d'exécution** :
1. Constructor
2. ngOnChanges
3. ngOnInit
4. ngAfterViewInit
5. ngOnDestroy (à la destruction)

---

## 📥 Input et Output

### @Input - Recevoir des données du parent
\`\`\`typescript
// Composant enfant
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: \`
    <div class="card">
      <h3>{{ userName }}</h3>
      <p>{{ userEmail }}</p>
    </div>
  \`
})
export class UserCardComponent {
  @Input() userName: string = '';
  @Input() userEmail: string = '';
}
\`\`\`

\`\`\`html
<!-- Composant parent -->
<app-user-card
  [userName]="'John Doe'"
  [userEmail]="'john@example.com'">
</app-user-card>
\`\`\`

### @Output - Émettre des événements vers le parent
\`\`\`typescript
// Composant enfant
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <button (click)="increment()">Count: {{ count }}</button>
  \`
})
export class CounterComponent {
  count = 0;
  @Output() countChanged = new EventEmitter<number>();

  increment(): void {
    this.count++;
    this.countChanged.emit(this.count);
  }
}
\`\`\`

\`\`\`html
<!-- Composant parent -->
<app-counter (countChanged)="onCountChange($event)"></app-counter>
\`\`\`

\`\`\`typescript
// Composant parent
export class ParentComponent {
  onCountChange(count: number): void {
    console.log('New count:', count);
  }
}
\`\`\`

---

## 🎨 Data Binding

### Interpolation {{ }}
\`\`\`html
<h1>{{ title }}</h1>
<p>{{ 2 + 2 }}</p>
<p>{{ user.name.toUpperCase() }}</p>
\`\`\`

### Property Binding [ ]
\`\`\`html
<img [src]="imageUrl">
<button [disabled]="isDisabled">Click me</button>
<div [class.active]="isActive">Active div</div>
<div [style.color]="textColor">Colored text</div>
\`\`\`

### Event Binding ( )
\`\`\`html
<button (click)="handleClick()">Click</button>
<input (keyup)="onKeyUp($event)">
<form (submit)="onSubmit()">...</form>
\`\`\`

### Two-Way Binding [( )]
\`\`\`typescript
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
  template: \`<input [(ngModel)]="userName">\`
})
export class MyComponent {
  userName = '';
}
\`\`\`

---

## 🎯 Directives Structurelles

### *ngIf - Affichage conditionnel
\`\`\`html
<p *ngIf="isLoggedIn">Welcome back!</p>

<div *ngIf="user; else loading">
  <h2>{{ user.name }}</h2>
</div>
<ng-template #loading>
  <p>Loading...</p>
</ng-template>
\`\`\`

### *ngFor - Boucles
\`\`\`html
<ul>
  <li *ngFor="let user of users; let i = index">
    {{ i + 1 }}. {{ user.name }}
  </li>
</ul>

<!-- Avec trackBy pour optimisation -->
<div *ngFor="let item of items; trackBy: trackById">
  {{ item.name }}
</div>
\`\`\`

\`\`\`typescript
trackById(index: number, item: any): number {
  return item.id;
}
\`\`\`

### *ngSwitch
\`\`\`html
<div [ngSwitch]="status">
  <p *ngSwitchCase="'loading'">Loading...</p>
  <p *ngSwitchCase="'success'">Success!</p>
  <p *ngSwitchCase="'error'">Error occurred</p>
  <p *ngSwitchDefault>Unknown status</p>
</div>
\`\`\`

---

## 🎨 Directives d'Attribut

### ngClass
\`\`\`html
<!-- Objet -->
<div [ngClass]="{ 'active': isActive, 'disabled': isDisabled }">

<!-- Tableau -->
<div [ngClass]="['btn', 'btn-primary']">

<!-- String -->
<div [ngClass]="'btn btn-primary'">
\`\`\`

### ngStyle
\`\`\`html
<div [ngStyle]="{
  'color': textColor,
  'font-size': fontSize + 'px',
  'background-color': bgColor
}">
  Styled text
</div>
\`\`\`

---

## 🔧 ViewChild et ContentChild

### @ViewChild - Accéder à un élément enfant
\`\`\`typescript
import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  template: \`<input #myInput type="text">\`
})
export class MyComponent {
  @ViewChild('myInput') inputElement!: ElementRef;

  ngAfterViewInit(): void {
    this.inputElement.nativeElement.focus();
  }
}
\`\`\`

### @ContentChild - Accéder au contenu projeté
\`\`\`typescript
@Component({
  selector: 'app-card',
  template: \`
    <div class="card">
      <ng-content></ng-content>
    </div>
  \`
})
export class CardComponent {
  @ContentChild('header') header!: ElementRef;
}
\`\`\`

---

## ❌ Erreurs Courantes

### 1. Oublier d'importer FormsModule
\`\`\`typescript
// ❌ Erreur: ngModel not found
// ✅ Solution
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule]
})
\`\`\`

### 2. Modifier les données après ngAfterViewInit
\`\`\`typescript
// ❌ ExpressionChangedAfterItHasBeenCheckedError
ngAfterViewInit(): void {
  this.data = 'new value'; // ❌
}

// ✅ Solution
ngAfterViewInit(): void {
  setTimeout(() => {
    this.data = 'new value';
  }, 0);
}
\`\`\`

### 3. Oublier de se désabonner
\`\`\`typescript
// ❌ Memory leak
ngOnInit(): void {
  this.dataService.getData().subscribe(data => {
    this.data = data;
  });
}

// ✅ Solution
private destroy$ = new Subject<void>();

ngOnInit(): void {
  this.dataService.getData()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.data = data);
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
\`\`\`

---

## 📋 Bonnes Pratiques

### 1. Composants Smart vs Dumb
**Smart (Container)** : Logique métier, appels API
\`\`\`typescript
@Component({
  selector: 'app-users-container',
  template: \`<app-user-list [users]="users$ | async"></app-user-list>\`
})
export class UsersContainerComponent {
  users$ = this.userService.getUsers();
  constructor(private userService: UserService) {}
}
\`\`\`

**Dumb (Presentational)** : Affichage seulement
\`\`\`typescript
@Component({
  selector: 'app-user-list',
  template: \`
    <div *ngFor="let user of users">
      {{ user.name }}
    </div>
  \`
})
export class UserListComponent {
  @Input() users: User[] = [];
}
\`\`\`

### 2. OnPush Change Detection
\`\`\`typescript
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedComponent {
  // Plus performant, détection manuelle
}
\`\`\`

### 3. Standalone Components (Angular 14+)
\`\`\`typescript
@Component({
  selector: 'app-standalone',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: \`...\`
})
export class StandaloneComponent {}
\`\`\`

---

## 📋 Checklist Composant

- [ ] Nom descriptif et cohérent
- [ ] Logique dans ngOnInit, pas dans le constructor
- [ ] @Input pour recevoir des données
- [ ] @Output avec EventEmitter pour émettre
- [ ] Désabonnement dans ngOnDestroy
- [ ] trackBy pour les *ngFor avec grandes listes
- [ ] ChangeDetectionStrategy.OnPush si possible
- [ ] Composants réutilisables et découplés
`
      },
      {
        id: 'frontend-services',
        title: 'Les Services Angular',
        category: GuideCategory.FRONTEND,
        icon: 'settings',
        color: '#3b82f6',
        order: 2,
        tags: ['Services', 'Injection', 'RxJS', 'Singleton'],
        lastUpdated: new Date(),
        content: `# Les Services Angular

## 📌 Qu'est-ce qu'un Service ?

Un **service** est une classe qui contient la logique métier et les données partagées. Il permet de :
- Centraliser la logique réutilisable
- Partager des données entre composants
- Communiquer avec des API
- Gérer l'état de l'application

---

## 🏗️ Créer un Service

### Avec Angular CLI
\`\`\`bash
# Générer un service
ng generate service services/user
# ou raccourci
ng g s services/user

# Avec un dossier spécifique
ng g s services/auth/auth
\`\`\`

### Structure générée
\`\`\`typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // Singleton global
})
export class UserService {
  constructor() { }
}
\`\`\`

---

## 💉 Injection de Dépendances

### Injecter un service dans un composant
\`\`\`typescript
import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-users',
  template: \`<div *ngFor="let user of users">{{ user.name }}</div>\`
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  // Injection dans le constructor
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.users = this.userService.getUsers();
  }
}
\`\`\`

### providedIn: 'root'
Le service est un **singleton** disponible partout.
\`\`\`typescript
@Injectable({
  providedIn: 'root'  // Une seule instance dans toute l'app
})
export class AuthService {}
\`\`\`

### Fournir au niveau du composant
Instance unique pour ce composant et ses enfants.
\`\`\`typescript
@Component({
  providers: [UserService]  // Nouvelle instance à chaque composant
})
export class UserComponent {
  constructor(private userService: UserService) {}
}
\`\`\`

---

## 🔧 Service de Gestion de Données

### Service CRUD basique
\`\`\`typescript
import { Injectable } from '@angular/core';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  addUser(user: User): void {
    this.users.push(user);
  }

  updateUser(id: number, updatedUser: Partial<User>): void {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updatedUser };
    }
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(u => u.id !== id);
  }
}
\`\`\`

---

## 📡 Service avec HttpClient

### Configuration HttpClient
\`\`\`typescript
// app.config.ts
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient()
  ]
};
\`\`\`

### Service API
\`\`\`typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // GET - Récupérer tous les utilisateurs
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(\`\${this.apiUrl}/users\`);
  }

  // GET - Récupérer un utilisateur par ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(\`\${this.apiUrl}/users/\${id}\`);
  }

  // POST - Créer un utilisateur
  createUser(user: User): Observable<User> {
    return this.http.post<User>(\`\${this.apiUrl}/users\`, user);
  }

  // PUT - Mettre à jour un utilisateur
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(\`\${this.apiUrl}/users/\${id}\`, user);
  }

  // DELETE - Supprimer un utilisateur
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/users/\${id}\`);
  }
}
\`\`\`

### Utilisation dans un composant
\`\`\`typescript
export class UsersComponent implements OnInit {
  users: User[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  deleteUser(id: number): void {
    this.apiService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
      },
      error: (error) => {
        console.error('Error deleting user:', error);
      }
    });
  }
}
\`\`\`

---

## 🔄 Service avec RxJS

### BehaviorSubject pour état partagé
\`\`\`typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  setUser(user: User): void {
    this.userSubject.next(user);
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  clearUser(): void {
    this.userSubject.next(null);
  }
}
\`\`\`

### Subject pour événements
\`\`\`typescript
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventSubject = new Subject<string>();
  public events$ = this.eventSubject.asObservable();

  emitEvent(event: string): void {
    this.eventSubject.next(event);
  }
}
\`\`\`

### Opérateurs RxJS utiles
\`\`\`typescript
import { map, filter, catchError, retry } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').pipe(
      retry(3),  // Réessayer 3 fois en cas d'erreur
      map(users => users.filter(u => u.active)),  // Filtrer
      catchError(error => {
        console.error('Error:', error);
        return of([]);  // Retourner tableau vide en cas d'erreur
      })
    );
  }
}
\`\`\`

---

## 🔐 Service d'Authentification

### AuthService complet
\`\`\`typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(\`\${this.apiUrl}/login\`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.currentUserSubject.next(user);
    }
  }
}
\`\`\`

---

## 🛡️ Intercepteur HTTP

### Ajouter automatiquement le token
\`\`\`typescript
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', \`Bearer \${token}\`)
    });
    return next(cloned);
  }

  return next(req);
};
\`\`\`

\`\`\`typescript
// app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
\`\`\`

---

## ⚠️ Gestion d'Erreurs

### Service avec gestion d'erreurs centralisée
\`\`\`typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = \`Erreur: \${error.error.message}\`;
    } else {
      // Erreur côté serveur
      errorMessage = \`Code: \${error.status}, Message: \${error.message}\`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
\`\`\`

---

## 📋 Bonnes Pratiques

### 1. Un service = Une responsabilité
\`\`\`typescript
// ❌ Mauvais : Service trop générique
export class DataService {
  getUsers() {}
  getProducts() {}
  getOrders() {}
}

// ✅ Bon : Services spécialisés
export class UserService {
  getUsers() {}
}
export class ProductService {
  getProducts() {}
}
\`\`\`

### 2. Utiliser des interfaces
\`\`\`typescript
export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  getUsers(): Observable<User[]> {
    // Type safety
  }
}
\`\`\`

### 3. Environnements pour les URLs
\`\`\`typescript
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;  // ✅ Configurable
  // private apiUrl = 'http://localhost:8080';  // ❌ Hardcodé
}
\`\`\`

### 4. Unsubscribe automatique
\`\`\`typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users'
})
export class UsersComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.userService.getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(users => this.users = users);
  }
}
\`\`\`

---

## 📋 Checklist Service

- [ ] @Injectable avec providedIn: 'root'
- [ ] Nom descriptif (UserService, AuthService)
- [ ] Logique métier isolée des composants
- [ ] Typage TypeScript avec interfaces
- [ ] Gestion d'erreurs avec catchError
- [ ] Utilisation d'Observables pour l'asynchrone
- [ ] BehaviorSubject pour état partagé
- [ ] Désabonnement des Observables
- [ ] Tests unitaires du service
`
      },

      // TESTS - Section complète
      {
        id: 'tests-backend-junit',
        title: 'Tests Backend - JUnit & Mockito',
        category: GuideCategory.TESTS,
        icon: 'science',
        color: '#8b5cf6',
        order: 1,
        tags: ['JUnit', 'Mockito', 'Tests Unitaires', 'Spring Boot'],
        lastUpdated: new Date(),
        content: `# Tests Backend - JUnit & Mockito

## 📌 Pourquoi Tester ?

Les tests permettent de :
- **Détecter les bugs** avant la production
- **Faciliter le refactoring** en toute confiance
- **Documenter** le comportement attendu du code
- **Améliorer la qualité** du code

---

## 🚀 Configuration Spring Boot

### Dépendances Maven

\`\`\`xml
<dependencies>
    <!-- Spring Boot Starter Test (inclut JUnit 5, Mockito, AssertJ) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>

    <!-- H2 Database pour les tests -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
\`\`\`

### Structure des Tests

\`\`\`
src/
├── main/
│   └── java/
│       └── com/example/demo/
│           ├── controller/
│           ├── service/
│           ├── repository/
│           └── model/
└── test/
    └── java/
        └── com/example/demo/
            ├── controller/
            ├── service/
            └── repository/
\`\`\`

---

## 🧪 Tests Unitaires avec JUnit 5

### Annotations Principales

\`\`\`java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Disabled;
import static org.junit.jupiter.api.Assertions.*;

public class CalculatorTest {

    private Calculator calculator;

    @BeforeEach
    void setUp() {
        // Exécuté avant CHAQUE test
        calculator = new Calculator();
    }

    @AfterEach
    void tearDown() {
        // Exécuté après CHAQUE test
        calculator = null;
    }

    @Test
    @DisplayName("Addition de deux nombres positifs")
    void testAddition() {
        // Arrange
        int a = 5;
        int b = 3;

        // Act
        int result = calculator.add(a, b);

        // Assert
        assertEquals(8, result);
    }

    @Test
    void testDivision() {
        // Vérifier qu'une exception est levée
        assertThrows(ArithmeticException.class, () -> {
            calculator.divide(10, 0);
        });
    }

    @Test
    @Disabled("Test désactivé temporairement")
    void testMultiplication() {
        // Ce test sera ignoré
    }
}
\`\`\`

### Assertions JUnit 5

\`\`\`java
// Égalité
assertEquals(expected, actual);
assertNotEquals(unexpected, actual);

// Vrai/Faux
assertTrue(condition);
assertFalse(condition);

// Null
assertNull(object);
assertNotNull(object);

// Identité (même référence)
assertSame(expected, actual);
assertNotSame(unexpected, actual);

// Collections
assertArrayEquals(expectedArray, actualArray);
assertIterableEquals(expectedList, actualList);

// Exceptions
assertThrows(Exception.class, () -> methodeThatThrows());

// Timeout
assertTimeout(Duration.ofSeconds(1), () -> method());

// Groupe d'assertions
assertAll(
    () -> assertEquals(expected1, actual1),
    () -> assertEquals(expected2, actual2),
    () -> assertTrue(condition)
);
\`\`\`

---

## 🎭 Mockito - Simuler les Dépendances

### Créer des Mocks

\`\`\`java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void testFindUserById() {
        // Arrange
        User user = new User(1L, "John Doe", "john@example.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // Act
        User result = userService.findById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void testCreateUser() {
        // Arrange
        User user = new User(null, "Jane Doe", "jane@example.com");
        User savedUser = new User(2L, "Jane Doe", "jane@example.com");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        User result = userService.createUser(user);

        // Assert
        assertNotNull(result.getId());
        assertEquals(2L, result.getId());
        verify(userRepository).save(user);
    }
}
\`\`\`

### Méthodes Mockito Utiles

\`\`\`java
// Définir un comportement
when(mock.method()).thenReturn(value);
when(mock.method()).thenThrow(new RuntimeException());
doThrow(new RuntimeException()).when(mock).voidMethod();

// Comportement pour n'importe quel argument
when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
when(userRepository.save(any(User.class))).thenReturn(savedUser);

// Vérifier les appels
verify(mock).method();
verify(mock, times(2)).method();
verify(mock, never()).method();
verify(mock, atLeast(1)).method();
verify(mock, atMost(3)).method();

// Capturer les arguments
ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
verify(userRepository).save(captor.capture());
User capturedUser = captor.getValue();
assertEquals("John", capturedUser.getName());
\`\`\`

---

## 🏗️ Tester les Services

### Exemple Complet

\`\`\`java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("Doit retourner tous les utilisateurs")
    void getAllUsers_ShouldReturnUserList() {
        // Arrange
        User user1 = new User(1L, "John", "john@example.com");
        User user2 = new User(2L, "Jane", "jane@example.com");
        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        // Act
        List<User> result = userService.getAllUsers();

        // Assert
        assertEquals(2, result.size());
        assertEquals("John", result.get(0).getName());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Doit créer un utilisateur avec succès")
    void createUser_ShouldReturnSavedUser() {
        // Arrange
        User newUser = new User(null, "Alice", "alice@example.com");
        User savedUser = new User(3L, "Alice", "alice@example.com");
        when(userRepository.save(newUser)).thenReturn(savedUser);

        // Act
        User result = userService.createUser(newUser);

        // Assert
        assertNotNull(result.getId());
        assertEquals(3L, result.getId());
        assertEquals("Alice", result.getName());
        verify(userRepository).save(newUser);
    }

    @Test
    @DisplayName("Doit lever une exception si l'utilisateur n'existe pas")
    void getUserById_ShouldThrowException_WhenUserNotFound() {
        // Arrange
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UserNotFoundException.class, () -> {
            userService.getUserById(99L);
        });
    }

    @Test
    @DisplayName("Doit supprimer un utilisateur")
    void deleteUser_ShouldDeleteUser() {
        // Arrange
        Long userId = 1L;
        when(userRepository.existsById(userId)).thenReturn(true);
        doNothing().when(userRepository).deleteById(userId);

        // Act
        userService.deleteUser(userId);

        // Assert
        verify(userRepository).deleteById(userId);
    }
}
\`\`\`

---

## 🗄️ Tester les Repositories

### Tests d'Intégration avec @DataJpaTest

\`\`\`java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    void findByEmail_ShouldReturnUser() {
        // Arrange
        User user = new User(null, "John Doe", "john@example.com");
        entityManager.persist(user);
        entityManager.flush();

        // Act
        Optional<User> found = userRepository.findByEmail("john@example.com");

        // Assert
        assertTrue(found.isPresent());
        assertEquals("John Doe", found.get().getName());
    }

    @Test
    void findByEmail_ShouldReturnEmpty_WhenUserNotFound() {
        // Act
        Optional<User> found = userRepository.findByEmail("nonexistent@example.com");

        // Assert
        assertFalse(found.isPresent());
    }

    @Test
    void existsByEmail_ShouldReturnTrue() {
        // Arrange
        User user = new User(null, "Jane", "jane@example.com");
        entityManager.persist(user);
        entityManager.flush();

        // Act
        boolean exists = userRepository.existsByEmail("jane@example.com");

        // Assert
        assertTrue(exists);
    }
}
\`\`\`

---

## 🎮 Tester les Controllers

### Tests avec @WebMvcTest

\`\`\`java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getAllUsers_ShouldReturnUserList() throws Exception {
        // Arrange
        User user1 = new User(1L, "John", "john@example.com");
        User user2 = new User(2L, "Jane", "jane@example.com");
        when(userService.getAllUsers()).thenReturn(Arrays.asList(user1, user2));

        // Act & Assert
        mockMvc.perform(get("/api/users")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("John"))
                .andExpect(jsonPath("$[1].name").value("Jane"));
    }

    @Test
    void createUser_ShouldReturnCreatedUser() throws Exception {
        // Arrange
        User newUser = new User(null, "Alice", "alice@example.com");
        User savedUser = new User(3L, "Alice", "alice@example.com");
        when(userService.createUser(any(User.class))).thenReturn(savedUser);

        // Act & Assert
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.name").value("Alice"));
    }

    @Test
    void getUserById_ShouldReturn404_WhenUserNotFound() throws Exception {
        // Arrange
        when(userService.getUserById(99L)).thenThrow(new UserNotFoundException(99L));

        // Act & Assert
        mockMvc.perform(get("/api/users/99"))
                .andExpect(status().isNotFound());
    }
}
\`\`\`

---

## 🔧 Configuration de Test

### application-test.properties

\`\`\`properties
# Base de données H2 en mémoire
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

# Désactiver les logs inutiles
logging.level.org.springframework=WARN
logging.level.org.hibernate=WARN
\`\`\`

### Profil de Test

\`\`\`java
@SpringBootTest
@ActiveProfiles("test")
class IntegrationTest {
    // Tests d'intégration complets
}
\`\`\`

---

## 📊 Couverture de Code

### Exécuter les tests avec couverture

\`\`\`bash
# Avec Maven
mvn clean test

# Avec Jacoco (rapport de couverture)
mvn clean test jacoco:report

# Voir le rapport : target/site/jacoco/index.html
\`\`\`

### Configuration Jacoco (pom.xml)

\`\`\`xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jacoco</groupId>
            <artifactId>jacoco-maven-plugin</artifactId>
            <version>0.8.10</version>
            <executions>
                <execution>
                    <goals>
                        <goal>prepare-agent</goal>
                    </goals>
                </execution>
                <execution>
                    <id>report</id>
                    <phase>test</phase>
                    <goals>
                        <goal>report</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
\`\`\`

---

## ❌ Erreurs Courantes

### 1. NullPointerException dans les tests

\`\`\`java
// ❌ Problème : Mock non initialisé
@Mock
private UserRepository userRepository;
// Oublié @ExtendWith(MockitoExtension.class)

// ✅ Solution
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock
    private UserRepository userRepository;
}
\`\`\`

### 2. Test qui modifie la BDD

\`\`\`java
// ❌ Problème : Test modifie la vraie BDD
@SpringBootTest
class UserServiceTest {
    // Utilise application.properties (BDD de prod)
}

// ✅ Solution : Utiliser @DataJpaTest ou profil test
@DataJpaTest
class UserRepositoryTest {
    // Utilise H2 en mémoire
}
\`\`\`

### 3. Tests qui dépendent de l'ordre

\`\`\`java
// ❌ Mauvais : Tests dépendent les uns des autres
@Test
void test1_CreateUser() {
    user = userService.create(new User(...));
}

@Test
void test2_UpdateUser() {
    userService.update(user); // user peut être null
}

// ✅ Bon : Chaque test est indépendant
@Test
void testCreateUser() {
    User user = userService.create(new User(...));
    assertNotNull(user);
}

@Test
void testUpdateUser() {
    User user = new User(...);
    userService.update(user);
    // Vérifications
}
\`\`\`

---

## 📋 Bonnes Pratiques

### 1. Convention de nommage

\`\`\`java
// Format : methodName_condition_expectedResult
void getUserById_WhenUserExists_ShouldReturnUser() {}
void getUserById_WhenUserNotFound_ShouldThrowException() {}
void createUser_WithValidData_ShouldReturnSavedUser() {}
\`\`\`

### 2. Pattern AAA (Arrange, Act, Assert)

\`\`\`java
@Test
void testExample() {
    // Arrange : Préparer les données
    User user = new User(1L, "John", "john@example.com");
    when(userRepository.findById(1L)).thenReturn(Optional.of(user));

    // Act : Exécuter la méthode testée
    User result = userService.getUserById(1L);

    // Assert : Vérifier le résultat
    assertNotNull(result);
    assertEquals("John", result.getName());
}
\`\`\`

### 3. Tests indépendants

- Chaque test doit pouvoir s'exécuter seul
- Utiliser @BeforeEach pour réinitialiser l'état
- Ne pas partager d'état entre tests

### 4. Tester les cas limites

\`\`\`java
@Test
void testWithEmptyList() { }

@Test
void testWithNullValue() { }

@Test
void testWithNegativeNumber() { }

@Test
void testWithVeryLargeNumber() { }
\`\`\`

---

## 📋 Checklist Tests Backend

- [ ] spring-boot-starter-test dans pom.xml
- [ ] Tests pour chaque Service
- [ ] Tests pour chaque Repository
- [ ] Tests pour chaque Controller
- [ ] Utilisation de Mockito pour les dépendances
- [ ] @DataJpaTest pour les tests de Repository
- [ ] @WebMvcTest pour les tests de Controller
- [ ] Couverture de code > 80%
- [ ] Tests des cas d'erreur
- [ ] Tests indépendants et reproductibles
- [ ] Configuration test avec H2
- [ ] Convention de nommage respectée
`
      },
      {
        id: 'tests-frontend-jasmine',
        title: 'Tests Frontend - Jasmine & Karma',
        category: GuideCategory.TESTS,
        icon: 'bug_report',
        color: '#8b5cf6',
        order: 2,
        tags: ['Jasmine', 'Karma', 'Angular', 'Tests Unitaires'],
        lastUpdated: new Date(),
        content: `# Tests Frontend - Jasmine & Karma

## 📌 Pourquoi Tester le Frontend ?

Les tests frontend permettent de :
- **Détecter les régressions** lors des modifications
- **Valider le comportement** des composants
- **Documenter** l'utilisation des composants
- **Faciliter le refactoring** en confiance

---

## 🚀 Configuration Angular

### Frameworks de Test Intégrés

Angular utilise par défaut :
- **Jasmine** : Framework de test (syntaxe des tests)
- **Karma** : Test runner (exécution des tests)

### Vérifier la Configuration

\`\`\`json
// package.json
{
  "devDependencies": {
    "jasmine-core": "~5.0.0",
    "karma": "~6.4.0",
    "karma-jasmine": "~5.1.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0"
  }
}
\`\`\`

### Lancer les Tests

\`\`\`bash
# Exécuter tous les tests
ng test

# Exécuter en mode headless (CI/CD)
ng test --browsers=ChromeHeadless --watch=false

# Avec rapport de couverture
ng test --code-coverage

# Test d'un fichier spécifique
ng test --include='**/user.service.spec.ts'
\`\`\`

---

## 🧪 Structure d'un Test Jasmine

### Syntaxe de Base

\`\`\`typescript
describe('NomDuComposant ou Service', () => {

  beforeEach(() => {
    // Exécuté avant CHAQUE test (it)
  });

  afterEach(() => {
    // Exécuté après CHAQUE test
  });

  beforeAll(() => {
    // Exécuté UNE FOIS avant tous les tests
  });

  afterAll(() => {
    // Exécuté UNE FOIS après tous les tests
  });

  it('should do something', () => {
    // Un test spécifique
    expect(true).toBe(true);
  });

  xit('should skip this test', () => {
    // Ce test sera ignoré (x devant it)
  });

  fit('should only run this test', () => {
    // Seuls les tests avec 'f' seront exécutés
  });
});
\`\`\`

### Matchers Jasmine

\`\`\`typescript
// Égalité
expect(value).toBe(expected);           // ===
expect(value).toEqual(expected);        // Deep equality
expect(value).not.toBe(unexpected);

// Vérité
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Nombres
expect(value).toBeGreaterThan(10);
expect(value).toBeLessThan(100);
expect(value).toBeCloseTo(10.5, 1);    // Précision décimale

// Chaînes
expect(value).toContain('substring');
expect(value).toMatch(/regex/);

// Tableaux et objets
expect(array).toContain(item);
expect(object).toHaveProperty('key');

// Exceptions
expect(() => fn()).toThrow();
expect(() => fn()).toThrowError('message');

// Espions
expect(spy).toHaveBeenCalled();
expect(spy).toHaveBeenCalledWith(arg1, arg2);
expect(spy).toHaveBeenCalledTimes(3);
\`\`\`

---

## 🧩 Tester un Service

### Service Simple

\`\`\`typescript
// calculator.service.ts
@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  add(a: number, b: number): number {
    return a + b;
  }

  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    return a / b;
  }
}
\`\`\`

\`\`\`typescript
// calculator.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add two numbers', () => {
    const result = service.add(2, 3);
    expect(result).toBe(5);
  });

  it('should divide two numbers', () => {
    const result = service.divide(10, 2);
    expect(result).toBe(5);
  });

  it('should throw error when dividing by zero', () => {
    expect(() => service.divide(10, 0)).toThrowError('Division by zero');
  });
});
\`\`\`

### Service avec HttpClient

\`\`\`typescript
// user.service.ts
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(\`\${this.apiUrl}/\${id}\`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
}
\`\`\`

\`\`\`typescript
// user.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes en attente
  });

  it('should fetch users', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'John', email: 'john@example.com' },
      { id: 2, name: 'Jane', email: 'jane@example.com' }
    ];

    service.getUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users[0].name).toBe('John');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should create a user', () => {
    const newUser: User = { id: 0, name: 'Alice', email: 'alice@example.com' };
    const savedUser: User = { id: 3, name: 'Alice', email: 'alice@example.com' };

    service.createUser(newUser).subscribe(user => {
      expect(user.id).toBe(3);
      expect(user.name).toBe('Alice');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(savedUser);
  });

  it('should handle error', () => {
    service.getUsers().subscribe(
      () => fail('Should have failed'),
      (error) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne('http://localhost:8080/api/users');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });
});
\`\`\`

---

## 🎨 Tester un Composant

### Composant Simple

\`\`\`typescript
// counter.component.ts
@Component({
  selector: 'app-counter',
  template: \`
    <div>
      <h2>{{ count }}</h2>
      <button (click)="increment()">Increment</button>
      <button (click)="decrement()">Decrement</button>
    </div>
  \`
})
export class CounterComponent {
  count = 0;

  increment(): void {
    this.count++;
  }

  decrement(): void {
    this.count--;
  }
}
\`\`\`

\`\`\`typescript
// counter.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent]  // Standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with count 0', () => {
    expect(component.count).toBe(0);
  });

  it('should increment count', () => {
    component.increment();
    expect(component.count).toBe(1);
  });

  it('should decrement count', () => {
    component.decrement();
    expect(component.count).toBe(-1);
  });

  it('should display count in template', () => {
    const compiled = fixture.nativeElement;
    const h2 = compiled.querySelector('h2');
    expect(h2.textContent).toContain('0');
  });

  it('should increment when button clicked', () => {
    const compiled = fixture.nativeElement;
    const button = compiled.querySelectorAll('button')[0];

    button.click();
    fixture.detectChanges();

    const h2 = compiled.querySelector('h2');
    expect(h2.textContent).toContain('1');
  });
});
\`\`\`

### Composant avec @Input et @Output

\`\`\`typescript
// user-card.component.ts
@Component({
  selector: 'app-user-card',
  template: \`
    <div class="card">
      <h3>{{ user.name }}</h3>
      <button (click)="onDelete()">Delete</button>
    </div>
  \`
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() delete = new EventEmitter<number>();

  onDelete(): void {
    this.delete.emit(this.user.id);
  }
}
\`\`\`

\`\`\`typescript
// user-card.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
  });

  it('should display user name', () => {
    component.user = { id: 1, name: 'John Doe', email: 'john@example.com' };
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const h3 = compiled.querySelector('h3');
    expect(h3.textContent).toContain('John Doe');
  });

  it('should emit delete event when button clicked', () => {
    component.user = { id: 1, name: 'John Doe', email: 'john@example.com' };

    spyOn(component.delete, 'emit');

    component.onDelete();

    expect(component.delete.emit).toHaveBeenCalledWith(1);
  });
});
\`\`\`

---

## 🎭 Espions (Spies)

### Espionner une Méthode

\`\`\`typescript
describe('UserComponent', () => {
  let component: UserComponent;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UserService', ['getUsers', 'deleteUser']);

    TestBed.configureTestingModule({
      providers: [
        { provide: UserService, useValue: spy }
      ]
    });

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    component = TestBed.createComponent(UserComponent).componentInstance;
  });

  it('should call getUsers on init', () => {
    userService.getUsers.and.returnValue(of([]));

    component.ngOnInit();

    expect(userService.getUsers).toHaveBeenCalled();
  });
});
\`\`\`

### Espionner avec spyOn

\`\`\`typescript
it('should call service method', () => {
  spyOn(userService, 'getUsers').and.returnValue(of(mockUsers));

  component.loadUsers();

  expect(userService.getUsers).toHaveBeenCalled();
  expect(component.users.length).toBe(2);
});

// Simuler un Observable
spyOn(userService, 'getUsers').and.returnValue(of(mockUsers));

// Simuler une erreur
spyOn(userService, 'getUsers').and.returnValue(throwError(() => new Error('Error')));

// Vérifier les appels
expect(spy).toHaveBeenCalled();
expect(spy).toHaveBeenCalledWith(arg1, arg2);
expect(spy).toHaveBeenCalledTimes(2);
\`\`\`

---

## 🔄 Tester les Observables

### Avec Marble Testing

\`\`\`typescript
import { TestScheduler } from 'rxjs/testing';

describe('Observable Tests', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should emit values', () => {
    scheduler.run(({ expectObservable }) => {
      const source$ = of(1, 2, 3);
      expectObservable(source$).toBe('(abc|)', { a: 1, b: 2, c: 3 });
    });
  });
});
\`\`\`

### Avec done()

\`\`\`typescript
it('should complete observable', (done) => {
  service.getUsers().subscribe({
    next: (users) => {
      expect(users.length).toBeGreaterThan(0);
    },
    complete: () => {
      done();
    }
  });
});
\`\`\`

---

## 📋 Bonnes Pratiques

### 1. Tests Isolés

\`\`\`typescript
// ❌ Mauvais : Dépend de l'ordre
let sharedUser: User;

it('test 1', () => {
  sharedUser = { id: 1, name: 'John' };
});

it('test 2', () => {
  expect(sharedUser.name).toBe('John'); // Peut échouer
});

// ✅ Bon : Chaque test est indépendant
it('test 1', () => {
  const user = { id: 1, name: 'John' };
  expect(user).toBeTruthy();
});

it('test 2', () => {
  const user = { id: 1, name: 'John' };
  expect(user.name).toBe('John');
});
\`\`\`

### 2. Utiliser beforeEach

\`\`\`typescript
describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Tests...
});
\`\`\`

### 3. Mock les Dépendances

\`\`\`typescript
// ✅ Mock le service au lieu d'utiliser le vrai
const mockUserService = {
  getUsers: () => of([mockUser1, mockUser2])
};

TestBed.configureTestingModule({
  providers: [
    { provide: UserService, useValue: mockUserService }
  ]
});
\`\`\`

---

## 📋 Checklist Tests Frontend

- [ ] Tests pour chaque composant
- [ ] Tests pour chaque service
- [ ] Utilisation de HttpClientTestingModule
- [ ] Spies pour les dépendances
- [ ] Tests des @Input et @Output
- [ ] Couverture de code > 80%
- [ ] Tests isolés et indépendants
- [ ] Vérifier les cas d'erreur
- [ ] fixture.detectChanges() après modifications
- [ ] httpMock.verify() après tests HTTP
`
      },
      {
        id: 'tests-e2e-cypress',
        title: 'Tests E2E - Cypress',
        category: GuideCategory.TESTS,
        icon: 'integration_instructions',
        color: '#8b5cf6',
        order: 3,
        tags: ['E2E', 'Cypress', 'Tests d\'intégration', 'Automation'],
        lastUpdated: new Date(),
        content: `# Tests E2E - Cypress

## 📌 Qu'est-ce qu'un Test E2E ?

Les tests **End-to-End** (E2E) simulent le comportement d'un utilisateur réel :
- Navigation dans l'application
- Remplissage de formulaires
- Clics sur les boutons
- Vérification des résultats

**Objectif** : Tester l'application complète (Frontend + Backend + BDD).

---

## 🚀 Installation de Cypress

### Avec Angular

\`\`\`bash
# Installer Cypress
npm install cypress --save-dev

# Ouvrir Cypress pour la première fois
npx cypress open

# Exécuter en mode headless (CI/CD)
npx cypress run
\`\`\`

### Structure Générée

\`\`\`
cypress/
├── e2e/
│   └── spec.cy.ts          # Fichiers de tests
├── fixtures/
│   └── example.json        # Données de test
├── support/
│   ├── commands.ts         # Commandes personnalisées
│   └── e2e.ts              # Configuration globale
└── cypress.config.ts       # Configuration Cypress
\`\`\`

---

## ⚙️ Configuration

### cypress.config.ts

\`\`\`typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
\`\`\`

### package.json Scripts

\`\`\`json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "e2e": "start-server-and-test start http://localhost:4200 cypress:open",
    "e2e:ci": "start-server-and-test start http://localhost:4200 cypress:run"
  }
}
\`\`\`

---

## 🧪 Premier Test Cypress

### Test Simple

\`\`\`typescript
// cypress/e2e/home.cy.ts
describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the title', () => {
    cy.contains('h1', 'Welcome to DevFlow');
  });

  it('should navigate to dashboard', () => {
    cy.get('a[href="/dashboard"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should have navigation menu', () => {
    cy.get('nav').should('be.visible');
    cy.get('nav a').should('have.length.greaterThan', 0);
  });
});
\`\`\`

---

## 🔍 Sélecteurs Cypress

### Bonnes Pratiques de Sélection

\`\`\`typescript
// ❌ Éviter les sélecteurs CSS fragiles
cy.get('.btn-primary');
cy.get('#user-123');

// ✅ Utiliser data-cy
cy.get('[data-cy="submit-button"]');
cy.get('[data-cy="user-card"]');

// HTML
<button data-cy="submit-button">Submit</button>
<div data-cy="user-card">...</div>
\`\`\`

### Méthodes de Sélection

\`\`\`typescript
// Par texte
cy.contains('Click me');
cy.contains('button', 'Submit');

// Par attribut
cy.get('[data-cy="login-button"]');
cy.get('input[name="email"]');
cy.get('input[type="password"]');

// Par classe
cy.get('.btn-primary');

// Par ID
cy.get('#user-form');

// Combinaisons
cy.get('form').find('input[name="email"]');
cy.get('nav').contains('Dashboard').click();

// Parent/Enfant
cy.get('.user-card').parent();
cy.get('.user-list').children();
cy.get('input').siblings();
\`\`\`

---

## 🎯 Actions Utilisateur

### Clics et Interactions

\`\`\`typescript
// Clic simple
cy.get('[data-cy="submit"]').click();

// Double-clic
cy.get('[data-cy="item"]').dblclick();

// Clic droit
cy.get('[data-cy="menu"]').rightclick();

// Clic sur une position spécifique
cy.get('[data-cy="canvas"]').click(100, 200);

// Force un clic même si l'élément est caché
cy.get('[data-cy="hidden-btn"]').click({ force: true });
\`\`\`

### Saisie de Texte

\`\`\`typescript
// Taper du texte
cy.get('input[name="email"]').type('user@example.com');

// Effacer et taper
cy.get('input[name="email"]').clear().type('new@example.com');

// Taper avec délai (simule une frappe humaine)
cy.get('input').type('Hello', { delay: 100 });

// Touches spéciales
cy.get('input').type('{enter}');
cy.get('input').type('{backspace}{backspace}');
cy.get('input').type('{selectall}{del}');
cy.get('input').type('{ctrl}a');
\`\`\`

### Sélections et Checkboxes

\`\`\`typescript
// Select
cy.get('select[name="country"]').select('France');
cy.get('select').select(['option1', 'option2']);

// Checkbox
cy.get('input[type="checkbox"]').check();
cy.get('input[type="checkbox"]').uncheck();
cy.get('[data-cy="terms"]').check().should('be.checked');

// Radio button
cy.get('input[type="radio"][value="yes"]').check();
\`\`\`

---

## ✅ Assertions

### Assertions Courantes

\`\`\`typescript
// Visibilité
cy.get('[data-cy="modal"]').should('be.visible');
cy.get('[data-cy="loading"]').should('not.exist');

// Texte
cy.get('h1').should('contain', 'Welcome');
cy.get('h1').should('have.text', 'Welcome to DevFlow');

// Attributs
cy.get('input').should('have.attr', 'placeholder', 'Enter email');
cy.get('button').should('have.class', 'btn-primary');
cy.get('a').should('have.attr', 'href', '/dashboard');

// Valeurs
cy.get('input[name="email"]').should('have.value', 'test@example.com');
cy.get('input[type="checkbox"]').should('be.checked');
cy.get('button').should('be.disabled');
cy.get('button').should('not.be.disabled');

// Nombre d'éléments
cy.get('.user-card').should('have.length', 5);
cy.get('li').should('have.length.greaterThan', 0);

// CSS
cy.get('.alert').should('have.css', 'color', 'rgb(255, 0, 0)');
\`\`\`

### Assertions Multiples

\`\`\`typescript
cy.get('[data-cy="user-name"]')
  .should('be.visible')
  .and('contain', 'John Doe')
  .and('have.class', 'active');
\`\`\`

---

## 🔐 Test de Formulaire de Connexion

### Exemple Complet

\`\`\`typescript
// cypress/e2e/login.cy.ts
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form', () => {
    cy.get('[data-cy="login-form"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('[data-cy="submit-button"]').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('[data-cy="submit-button"]').click();

    cy.get('[data-cy="error-message"]')
      .should('be.visible')
      .and('contain', 'Invalid credentials');
  });

  it('should login successfully', () => {
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('[data-cy="submit-button"]').click();

    // Vérifier la redirection
    cy.url().should('include', '/dashboard');

    // Vérifier que l'utilisateur est connecté
    cy.get('[data-cy="user-menu"]').should('contain', 'user@example.com');
  });

  it('should validate required fields', () => {
    cy.get('[data-cy="submit-button"]').click();

    cy.get('input[name="email"]').should('have.class', 'ng-invalid');
    cy.get('input[name="password"]').should('have.class', 'ng-invalid');
  });

  it('should validate email format', () => {
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('input[name="email"]').blur();

    cy.get('[data-cy="email-error"]')
      .should('be.visible')
      .and('contain', 'Invalid email');
  });
});
\`\`\`

---

## 🔄 Commandes Personnalisées

### Définir une Commande

\`\`\`typescript
// cypress/support/commands.ts
declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<void>;
    logout(): Chainable<void>;
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('[data-cy="submit-button"]').click();
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="user-menu"]').click();
  cy.get('[data-cy="logout-button"]').click();
  cy.url().should('include', '/login');
});
\`\`\`

### Utiliser les Commandes

\`\`\`typescript
describe('Dashboard', () => {
  beforeEach(() => {
    cy.login('user@example.com', 'password123');
  });

  it('should display user dashboard', () => {
    cy.get('[data-cy="welcome-message"]').should('contain', 'Welcome');
  });

  afterEach(() => {
    cy.logout();
  });
});
\`\`\`

---

## 📡 Intercepter les Requêtes API

### Mock les Réponses

\`\`\`typescript
describe('User List', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ]
    }).as('getUsers');

    cy.visit('/users');
  });

  it('should display users from API', () => {
    cy.wait('@getUsers');
    cy.get('[data-cy="user-card"]').should('have.length', 2);
    cy.contains('John Doe').should('be.visible');
  });
});
\`\`\`

### Tester les Erreurs

\`\`\`typescript
it('should handle API error', () => {
  cy.intercept('GET', '/api/users', {
    statusCode: 500,
    body: { error: 'Internal Server Error' }
  }).as('getUsersError');

  cy.visit('/users');
  cy.wait('@getUsersError');

  cy.get('[data-cy="error-message"]')
    .should('be.visible')
    .and('contain', 'Failed to load users');
});
\`\`\`

### Vérifier les Requêtes

\`\`\`typescript
it('should send correct data', () => {
  cy.intercept('POST', '/api/users').as('createUser');

  cy.get('input[name="name"]').type('Alice');
  cy.get('input[name="email"]').type('alice@example.com');
  cy.get('[data-cy="submit"]').click();

  cy.wait('@createUser').its('request.body').should('deep.equal', {
    name: 'Alice',
    email: 'alice@example.com'
  });
});
\`\`\`

---

## 📸 Captures d'Écran et Vidéos

### Captures d'Écran

\`\`\`typescript
it('should take screenshot on failure', () => {
  cy.get('[data-cy="non-existent"]').should('exist');
  // Screenshot automatique si le test échoue
});

// Screenshot manuel
cy.screenshot('login-page');
cy.get('[data-cy="modal"]').screenshot('modal-opened');
\`\`\`

### Vidéos

Les vidéos sont automatiquement enregistrées lors de \`cypress run\`.

\`\`\`bash
# Les vidéos sont dans cypress/videos/
cypress run

# Désactiver les vidéos
cypress run --config video=false
\`\`\`

---

## ⏱️ Attentes et Timeouts

### Wait

\`\`\`typescript
// Attendre une requête
cy.wait('@getUsersAPI');

// Attendre un temps fixe (à éviter)
cy.wait(1000);

// Attendre qu'un élément apparaisse
cy.get('[data-cy="modal"]', { timeout: 10000 }).should('be.visible');
\`\`\`

### Retry et Timeout

\`\`\`typescript
// Cypress réessaie automatiquement jusqu'à ce que l'assertion passe
cy.get('[data-cy="loading"]').should('not.exist'); // Réessaie pendant 4s par défaut

// Augmenter le timeout
cy.get('[data-cy="slow-element"]', { timeout: 10000 }).should('be.visible');
\`\`\`

---

## 📋 Bonnes Pratiques

### 1. Utiliser data-cy

\`\`\`html
<!-- ✅ Bon -->
<button data-cy="submit-button">Submit</button>

<!-- ❌ Éviter -->
<button class="btn btn-primary">Submit</button>
\`\`\`

### 2. Tests Indépendants

\`\`\`typescript
// ❌ Mauvais : Tests dépendent les uns des autres
it('create user', () => {
  // Crée un utilisateur
});

it('edit user', () => {
  // Suppose que l'utilisateur existe
});

// ✅ Bon : Chaque test est isolé
it('create user', () => {
  // Crée et vérifie
});

it('edit user', () => {
  cy.login();
  // Crée d'abord un utilisateur
  // Puis l'édite
});
\`\`\`

### 3. Utiliser Fixtures

\`\`\`json
// cypress/fixtures/users.json
{
  "validUser": {
    "email": "user@example.com",
    "password": "password123"
  },
  "invalidUser": {
    "email": "wrong@example.com",
    "password": "wrongpass"
  }
}
\`\`\`

\`\`\`typescript
cy.fixture('users').then((users) => {
  cy.login(users.validUser.email, users.validUser.password);
});
\`\`\`

---

## 📋 Checklist Tests E2E

- [ ] Cypress installé et configuré
- [ ] Tests pour les flux principaux (login, CRUD)
- [ ] Utilisation de data-cy pour les sélecteurs
- [ ] Commandes personnalisées pour actions répétitives
- [ ] Interception des requêtes API
- [ ] Tests des cas d'erreur
- [ ] Tests indépendants
- [ ] Fixtures pour les données de test
- [ ] Screenshots et vidéos activés
- [ ] Tests exécutables en CI/CD (headless)
- [ ] Timeouts appropriés
- [ ] Documentation des scénarios testés
`
      },

      // SONARQUBE - Section complète
      {
        id: 'sonarqube-intro',
        title: 'Introduction à SonarQube',
        category: GuideCategory.SONARQUBE,
        icon: 'radar',
        color: '#06b6d4',
        order: 1,
        tags: ['SonarQube', 'Qualité', 'Code Analysis', 'Setup'],
        lastUpdated: new Date(),
        content: `# Introduction à SonarQube

## 📌 Qu'est-ce que SonarQube ?

**SonarQube** est une plateforme open-source d'inspection continue de la qualité du code. Elle permet de :
- **Détecter les bugs** automatiquement
- **Identifier les vulnérabilités** de sécurité
- **Mesurer la dette technique**
- **Analyser la duplication** de code
- **Vérifier la couverture** de tests
- **Appliquer les standards** de codage

---

## 🎯 Pourquoi Utiliser SonarQube ?

### Bénéfices

✅ **Qualité** : Code plus propre et maintenable
✅ **Sécurité** : Détection des failles de sécurité
✅ **Dette technique** : Visualisation et priorisation
✅ **Standards** : Application automatique des règles
✅ **Évolution** : Suivi de la qualité dans le temps
✅ **Code Review** : Automatisation d'une partie de la revue

### Métriques Clés

- **Bugs** : Problèmes fonctionnels
- **Vulnérabilités** : Failles de sécurité
- **Code Smells** : Problèmes de maintenabilité
- **Duplication** : Code dupliqué
- **Coverage** : Couverture de tests
- **Debt** : Dette technique estimée

---

## 🚀 Installation de SonarQube

### Prérequis

- **Java 17** ou supérieur
- **Base de données** : PostgreSQL (recommandé), MySQL, SQL Server, ou Oracle
- **4 GB RAM** minimum (8 GB recommandé)

### Option 1 : Installation avec Docker (Recommandé)

\\\`\\\`\\\`bash
# Créer un réseau Docker
docker network create sonarnet

# Lancer PostgreSQL
docker run -d --name sonarqube-db \\
  --network sonarnet \\
  -e POSTGRES_USER=sonar \\
  -e POSTGRES_PASSWORD=sonar \\
  -e POSTGRES_DB=sonarqube \\
  postgres:15

# Lancer SonarQube
docker run -d --name sonarqube \\
  --network sonarnet \\
  -p 9000:9000 \\
  -e SONAR_JDBC_URL=jdbc:postgresql://sonarqube-db:5432/sonarqube \\
  -e SONAR_JDBC_USERNAME=sonar \\
  -e SONAR_JDBC_PASSWORD=sonar \\
  sonarqube:lts-community
\\\`\\\`\\\`

### Option 2 : Docker Compose

\\\`\\\`\\\`yaml
# docker-compose.yml
version: "3"

services:
  sonarqube:
    image: sonarqube:lts-community
    depends_on:
      - db
    environment:
      SONAR_JDBC_URL: jdbc:postgresql://db:5432/sonarqube
      SONAR_JDBC_USERNAME: sonar
      SONAR_JDBC_PASSWORD: sonar
    ports:
      - "9000:9000"
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_extensions:/opt/sonarqube/extensions
      - sonarqube_logs:/opt/sonarqube/logs

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: sonar
      POSTGRES_PASSWORD: sonar
      POSTGRES_DB: sonarqube
    volumes:
      - postgresql:/var/lib/postgresql
      - postgresql_data:/var/lib/postgresql/data

volumes:
  sonarqube_data:
  sonarqube_extensions:
  sonarqube_logs:
  postgresql:
  postgresql_data:
\\\`\\\`\\\`

\\\`\\\`\\\`bash
# Démarrer SonarQube
docker-compose up -d

# Vérifier les logs
docker-compose logs -f sonarqube
\\\`\\\`\\\`

---

## 📋 Checklist Installation

- [ ] SonarQube installé (Docker ou manuel)
- [ ] Accessible sur http://localhost:9000
- [ ] Mot de passe admin changé
- [ ] Token d'accès créé et sauvegardé
- [ ] Projet créé dans SonarQube
- [ ] Plugin Maven/SonarScanner installé
- [ ] sonar-project.properties configuré
- [ ] Première analyse réussie
- [ ] Résultats visibles dans l'interface
- [ ] Quality Gate configuré
`
      },

      // DOCKER - Section complète
      {
        id: 'docker-intro',
        title: 'Introduction à Docker',
        category: GuideCategory.DOCKER,
        icon: 'dock',
        color: '#0ea5e9',
        order: 1,
        tags: ['Docker', 'Containers', 'Setup', 'Images'],
        lastUpdated: new Date(),
        content: `# Introduction à Docker

## 📌 Qu'est-ce que Docker ?

**Docker** est une plateforme de containerisation qui permet d'empaqueter une application et ses dépendances dans un conteneur léger et portable.

### Avantages

✅ **Portabilité** : Fonctionne partout (dev, test, prod)
✅ **Isolation** : Chaque conteneur est isolé
✅ **Léger** : Plus rapide que les VMs
✅ **Reproductibilité** : Même environnement partout
✅ **Scalabilité** : Facile à dupliquer

---

## 🏗️ Concepts Clés

### Image

Un **modèle** immuable contenant l'application et ses dépendances.
- Base pour créer des conteneurs
- Stockée dans un registry (Docker Hub)

### Conteneur

Une **instance** d'une image en cours d'exécution.
- Processus isolé
- Possède son propre système de fichiers
- Éphémère par défaut

### Dockerfile

Un **fichier texte** contenant les instructions pour construire une image.

### Volume

Un **espace de stockage** persistant partagé entre l'hôte et le conteneur.

### Network

Un **réseau virtuel** permettant aux conteneurs de communiquer.

---

## 🚀 Installation de Docker

### Windows

1. Télécharger [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Installer et redémarrer
3. Vérifier :
\`\`\`bash
docker --version
docker run hello-world
\`\`\`

### macOS

\`\`\`bash
# Avec Homebrew
brew install --cask docker

# Ou télécharger Docker Desktop
# https://www.docker.com/products/docker-desktop
\`\`\`

### Linux (Ubuntu/Debian)

\`\`\`bash
# Désinstaller anciennes versions
sudo apt-get remove docker docker-engine docker.io containerd runc

# Installer dépendances
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg lsb-release

# Ajouter clé GPG officielle
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Ajouter le repository
echo \\
  "deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \\
  \$(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installer Docker
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Vérifier
sudo docker run hello-world

# Utiliser sans sudo
sudo usermod -aG docker \$USER
newgrp docker
\`\`\`

---

## 📦 Commandes Docker de Base

### Images

\`\`\`bash
# Lister les images
docker images
docker image ls

# Télécharger une image
docker pull nginx
docker pull postgres:15

# Supprimer une image
docker rmi nginx
docker image rm nginx

# Supprimer toutes les images inutilisées
docker image prune -a
\`\`\`

### Conteneurs

\`\`\`bash
# Lancer un conteneur
docker run nginx
docker run -d nginx                    # Mode détaché (background)
docker run -d --name my-nginx nginx   # Avec un nom
docker run -d -p 8080:80 nginx        # Avec port mapping

# Lister les conteneurs
docker ps                    # Conteneurs actifs
docker ps -a                # Tous les conteneurs

# Arrêter un conteneur
docker stop my-nginx
docker stop <container_id>

# Démarrer un conteneur arrêté
docker start my-nginx

# Redémarrer
docker restart my-nginx

# Supprimer un conteneur
docker rm my-nginx
docker rm -f my-nginx       # Force (même si actif)

# Supprimer tous les conteneurs arrêtés
docker container prune
\`\`\`

### Logs et Exécution

\`\`\`bash
# Voir les logs
docker logs my-nginx
docker logs -f my-nginx     # Mode suivi (tail -f)
docker logs --tail 100 my-nginx

# Exécuter une commande dans un conteneur
docker exec my-nginx ls
docker exec -it my-nginx bash    # Shell interactif

# Inspecter un conteneur
docker inspect my-nginx

# Statistiques
docker stats
docker stats my-nginx
\`\`\`

---

## 🐳 Créer un Dockerfile

### Backend Spring Boot

\`\`\`dockerfile
# Dockerfile
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Copier les fichiers Maven
COPY pom.xml .
COPY src ./src

# Build de l'application
RUN ./mvnw clean package -DskipTests

# Image finale
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copier le JAR depuis l'étape build
COPY --from=build /app/target/*.jar app.jar

# Port exposé
EXPOSE 8080

# Commande de démarrage
ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\`

### Frontend Angular

\`\`\`dockerfile
# Dockerfile

# Étape 1 : Build
FROM node:20-alpine AS build

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build de production
RUN npm run build

# Étape 2 : Serveur Nginx
FROM nginx:alpine

# Copier la configuration Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers buildés
COPY --from=build /app/dist/devflow /usr/share/nginx/html

# Exposer le port
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

### Configuration Nginx

\`\`\`nginx
# nginx.conf
events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
      try_files \$uri \$uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
  }
}
\`\`\`

---

## 🔧 Construire et Lancer une Image

### Build

\`\`\`bash
# Backend
docker build -t devflow-backend:latest .

# Frontend
docker build -t devflow-frontend:latest .

# Avec un tag spécifique
docker build -t devflow-backend:1.0.0 .

# Depuis un autre Dockerfile
docker build -f Dockerfile.prod -t devflow-backend:prod .
\`\`\`

### Run

\`\`\`bash
# Backend
docker run -d \\
  --name devflow-api \\
  -p 8080:8080 \\
  -e SPRING_PROFILES_ACTIVE=prod \\
  devflow-backend:latest

# Frontend
docker run -d \\
  --name devflow-app \\
  -p 80:80 \\
  devflow-frontend:latest

# Avec variables d'environnement
docker run -d \\
  --name devflow-api \\
  -p 8080:8080 \\
  -e DATABASE_URL=jdbc:postgresql://db:5432/devflow \\
  -e DATABASE_USER=admin \\
  -e DATABASE_PASSWORD=secret \\
  devflow-backend:latest
\`\`\`

---

## 💾 Volumes

### Créer et Utiliser des Volumes

\`\`\`bash
# Créer un volume
docker volume create devflow-data

# Lister les volumes
docker volume ls

# Utiliser un volume
docker run -d \\
  --name postgres \\
  -v devflow-data:/var/lib/postgresql/data \\
  postgres:15

# Bind mount (dossier local)
docker run -d \\
  --name nginx \\
  -v /path/to/html:/usr/share/nginx/html \\
  nginx

# Inspecter un volume
docker volume inspect devflow-data

# Supprimer un volume
docker volume rm devflow-data

# Supprimer tous les volumes inutilisés
docker volume prune
\`\`\`

---

## 🌐 Networks

### Créer et Utiliser des Réseaux

\`\`\`bash
# Créer un réseau
docker network create devflow-net

# Lister les réseaux
docker network ls

# Connecter un conteneur au réseau
docker run -d \\
  --name api \\
  --network devflow-net \\
  devflow-backend

docker run -d \\
  --name db \\
  --network devflow-net \\
  postgres:15

# Les conteneurs peuvent communiquer via leur nom
# api peut accéder à db via : jdbc:postgresql://db:5432/devflow

# Inspecter un réseau
docker network inspect devflow-net

# Supprimer un réseau
docker network rm devflow-net
\`\`\`

---

## 🔍 Debugging

### Logs

\`\`\`bash
# Voir tous les logs
docker logs my-container

# Suivre les logs en temps réel
docker logs -f my-container

# Dernières 100 lignes
docker logs --tail 100 my-container

# Avec timestamps
docker logs -t my-container
\`\`\`

### Shell Interactif

\`\`\`bash
# Accéder au shell
docker exec -it my-container bash
docker exec -it my-container sh    # Alpine Linux

# Vérifier les processus
docker exec my-container ps aux

# Vérifier les fichiers
docker exec my-container ls -la /app
\`\`\`

### Inspection

\`\`\`bash
# Détails complets
docker inspect my-container

# Adresse IP
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' my-container

# Variables d'environnement
docker inspect -f '{{.Config.Env}}' my-container
\`\`\`

---

## 📋 Bonnes Pratiques

### 1. Utiliser .dockerignore

\`\`\`
# .dockerignore
node_modules
npm-debug.log
dist
.git
.env
*.md
target
.mvn
\`\`\`

### 2. Multi-stage Builds

Réduire la taille de l'image finale :
\`\`\`dockerfile
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
\`\`\`

### 3. Ne Pas Exécuter en Root

\`\`\`dockerfile
FROM node:20-alpine

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

USER nodejs

WORKDIR /app
COPY --chown=nodejs:nodejs . .

CMD ["node", "server.js"]
\`\`\`

### 4. Minimiser les Layers

\`\`\`dockerfile
# ❌ Mauvais : 3 layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git

# ✅ Bon : 1 layer
RUN apt-get update && apt-get install -y \\
    curl \\
    git \\
    && rm -rf /var/lib/apt/lists/*
\`\`\`

---

## ❌ Erreurs Courantes

### 1. Port déjà utilisé

\`\`\`bash
# Erreur : Port 8080 déjà utilisé
# Solution : Utiliser un autre port
docker run -p 8081:8080 my-image
\`\`\`

### 2. Conteneur se termine immédiatement

\`\`\`bash
# Vérifier les logs
docker logs <container_id>

# Le conteneur doit avoir un processus au premier plan
CMD ["nginx", "-g", "daemon off;"]  # ✅
CMD ["nginx"]                        # ❌ Se termine
\`\`\`

### 3. Permission denied

\`\`\`bash
# Linux : Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker \$USER
newgrp docker
\`\`\`

---

## 📋 Checklist Docker

- [ ] Docker installé et fonctionnel
- [ ] \`docker run hello-world\` réussit
- [ ] Comprendre images vs conteneurs
- [ ] Savoir lire un Dockerfile
- [ ] Créer un Dockerfile simple
- [ ] Build d'une image
- [ ] Run d'un conteneur
- [ ] Utiliser les volumes
- [ ] Créer un réseau
- [ ] Debugger avec logs et exec
- [ ] Utiliser .dockerignore
- [ ] Connaître les bonnes pratiques

---

## 🎯 Commandes Essentielles

\`\`\`bash
# Images
docker pull <image>
docker build -t <name> .
docker images
docker rmi <image>

# Conteneurs
docker run -d -p 8080:80 --name <name> <image>
docker ps
docker stop <container>
docker rm <container>
docker logs -f <container>
docker exec -it <container> bash

# Nettoyage
docker system prune -a
docker volume prune
docker network prune
\`\`\`
`
      },
      {
        id: 'docker-compose',
        title: 'Docker Compose',
        category: GuideCategory.DOCKER,
        icon: 'layers',
        color: '#0ea5e9',
        order: 2,
        tags: ['Docker Compose', 'Multi-containers', 'Orchestration', 'YAML'],
        lastUpdated: new Date(),
        content: `# Docker Compose

## 📌 Qu'est-ce que Docker Compose ?

**Docker Compose** est un outil pour définir et exécuter des applications multi-conteneurs.

### Avantages

✅ **Configuration** : Tout dans un fichier YAML
✅ **Simplicité** : Une commande pour tout lancer
✅ **Reproductibilité** : Partager facilement la stack
✅ **Dev/Prod** : Même configuration partout

---

## 📄 Structure docker-compose.yml

### Exemple Complet DevFlow

\`\`\`yaml
# docker-compose.yml
version: '3.8'

services:
  # Base de données PostgreSQL
  db:
    image: postgres:15-alpine
    container_name: devflow-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: devflow
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - devflow-net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend Spring Boot
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: devflow-api
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/devflow
      SPRING_DATASOURCE_USERNAME: admin
      SPRING_DATASOURCE_PASSWORD: secret
    ports:
      - "8080:8080"
    networks:
      - devflow-net
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend Angular
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: devflow-app
    restart: unless-stopped
    depends_on:
      - backend
    ports:
      - "80:80"
    networks:
      - devflow-net

volumes:
  postgres-data:
    driver: local

networks:
  devflow-net:
    driver: bridge
\`\`\`

---

## 🚀 Commandes Docker Compose

### Gestion de Base

\`\`\`bash
# Démarrer tous les services
docker-compose up

# Mode détaché (background)
docker-compose up -d

# Avec rebuild des images
docker-compose up --build

# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v

# Arrêter sans supprimer les conteneurs
docker-compose stop

# Redémarrer les services
docker-compose restart

# Redémarrer un service spécifique
docker-compose restart backend
\`\`\`

### Logs et Monitoring

\`\`\`bash
# Voir tous les logs
docker-compose logs

# Suivre les logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend

# Dernières 100 lignes
docker-compose logs --tail=100

# Voir l'état des services
docker-compose ps

# Voir les processus
docker-compose top
\`\`\`

### Build et Images

\`\`\`bash
# Build de tous les services
docker-compose build

# Build d'un service spécifique
docker-compose build backend

# Build sans cache
docker-compose build --no-cache

# Pull des images
docker-compose pull
\`\`\`

### Exécution de Commandes

\`\`\`bash
# Exécuter une commande
docker-compose exec backend bash
docker-compose exec db psql -U admin -d devflow

# Exécuter une commande one-shot
docker-compose run backend npm test

# Scaler un service
docker-compose up -d --scale backend=3
\`\`\`

---

## 🔧 Configuration Avancée

### Variables d'Environnement

#### Fichier .env

\`\`\`bash
# .env
POSTGRES_DB=devflow
POSTGRES_USER=admin
POSTGRES_PASSWORD=secret123
BACKEND_PORT=8080
FRONTEND_PORT=80
\`\`\`

#### Utilisation dans docker-compose.yml

\`\`\`yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: \${POSTGRES_DB}
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    ports:
      - "\${DB_PORT:-5432}:5432"
\`\`\`

### Fichiers de Configuration Multiples

\`\`\`bash
# docker-compose.override.yml (automatiquement chargé)
version: '3.8'

services:
  backend:
    volumes:
      - ./backend:/app
    command: npm run dev

# Utiliser un fichier spécifique
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
\`\`\`

---

## 🌍 Environnements Dev/Prod

### docker-compose.yml (Base)

\`\`\`yaml
version: '3.8'

services:
  backend:
    build: ./backend
    environment:
      - NODE_ENV=production
    ports:
      - "8080:8080"
\`\`\`

### docker-compose.dev.yml

\`\`\`yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      target: development
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev
\`\`\`

### docker-compose.prod.yml

\`\`\`yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      target: production
    restart: always
    environment:
      - NODE_ENV=production
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
\`\`\`

### Utilisation

\`\`\`bash
# Dev
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Prod
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
\`\`\`

---

## 💾 Gestion des Volumes

### Types de Volumes

\`\`\`yaml
services:
  backend:
    volumes:
      # Named volume (géré par Docker)
      - app-data:/app/data

      # Bind mount (dossier local)
      - ./backend:/app

      # Anonymous volume
      - /app/node_modules

      # Volume en lecture seule
      - ./config:/app/config:ro

volumes:
  app-data:
\`\`\`

### Backup et Restore

\`\`\`bash
# Backup d'un volume
docker run --rm \\
  -v devflow_postgres-data:/data \\
  -v \$(pwd):/backup \\
  alpine tar czf /backup/db-backup.tar.gz /data

# Restore
docker run --rm \\
  -v devflow_postgres-data:/data \\
  -v \$(pwd):/backup \\
  alpine tar xzf /backup/db-backup.tar.gz -C /
\`\`\`

---

## 🌐 Réseaux

### Configuration Réseau

\`\`\`yaml
version: '3.8'

services:
  backend:
    networks:
      - frontend-net
      - backend-net

  db:
    networks:
      - backend-net

  frontend:
    networks:
      - frontend-net

networks:
  frontend-net:
    driver: bridge
  backend-net:
    driver: bridge
    internal: true  # Pas d'accès externe
\`\`\`

---

## 🏥 Health Checks

### Configuration

\`\`\`yaml
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \$\${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
\`\`\`

### Dépendances avec Health Checks

\`\`\`yaml
services:
  backend:
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
\`\`\`

---

## 🔐 Secrets et Configuration

### Utiliser des Secrets

\`\`\`yaml
version: '3.8'

services:
  backend:
    secrets:
      - db_password
      - api_key
    environment:
      DB_PASSWORD_FILE: /run/secrets/db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
  api_key:
    external: true
\`\`\`

### Configuration Externe

\`\`\`yaml
services:
  backend:
    configs:
      - source: backend_config
        target: /app/config.json

configs:
  backend_config:
    file: ./config/backend.json
\`\`\`

---

## 📊 Stack Full Exemple

\`\`\`yaml
version: '3.8'

services:
  # Base de données
  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: devflow
      POSTGRES_USER: \${DB_USER}
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - backend
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${DB_USER}"]
      interval: 10s

  # Redis Cache
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - backend

  # Backend API
  api:
    build:
      context: ./backend
      target: production
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    environment:
      DATABASE_URL: postgresql://\${DB_USER}:\${DB_PASSWORD}@postgres:5432/devflow
      REDIS_URL: redis://redis:6379
      JWT_SECRET: \${JWT_SECRET}
    ports:
      - "8080:8080"
    networks:
      - backend
      - frontend
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:8080/health"]
      interval: 30s

  # Frontend
  app:
    build:
      context: ./frontend
    restart: unless-stopped
    depends_on:
      - api
    ports:
      - "80:80"
    networks:
      - frontend

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    restart: unless-stopped
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - "443:443"
    depends_on:
      - app
      - api
    networks:
      - frontend

volumes:
  postgres-data:
  redis-data:

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true
\`\`\`

---

## 📋 Bonnes Pratiques

### 1. Utiliser .env pour les Secrets

\`\`\`bash
# .env
DB_PASSWORD=super_secret_password
JWT_SECRET=another_secret

# .gitignore
.env
\`\`\`

### 2. Version Spécifique des Images

\`\`\`yaml
# ❌ Mauvais
image: postgres

# ✅ Bon
image: postgres:15-alpine
\`\`\`

### 3. Restart Policy

\`\`\`yaml
services:
  backend:
    restart: unless-stopped  # Redémarre sauf si arrêt manuel
\`\`\`

### 4. Limiter les Ressources

\`\`\`yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
\`\`\`

---

## 📋 Checklist Docker Compose

- [ ] docker-compose.yml créé
- [ ] Services définis correctement
- [ ] Variables d'environnement dans .env
- [ ] Volumes configurés pour persistence
- [ ] Réseaux définis pour isolation
- [ ] Health checks configurés
- [ ] depends_on utilisé correctement
- [ ] restart policy défini
- [ ] \`docker-compose up\` fonctionne
- [ ] Logs accessibles via \`docker-compose logs\`

---

## 🎯 Commandes Essentielles

\`\`\`bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Logs
docker-compose logs -f

# Rebuild
docker-compose up --build

# État
docker-compose ps

# Exécuter une commande
docker-compose exec backend bash
\`\`\`
`
      },
      {
        id: 'docker-production',
        title: 'Docker en Production',
        category: GuideCategory.DOCKER,
        icon: 'rocket_launch',
        color: '#0ea5e9',
        order: 3,
        tags: ['Production', 'Security', 'Performance', 'Best Practices'],
        lastUpdated: new Date(),
        content: `# Docker en Production

## 📌 Différences Dev vs Prod

### Développement

- Hot reload activé
- Debugging actif
- Logs verbeux
- Volumes bind mount
- Pas de limite de ressources

### Production

- Build optimisé
- Pas de debugging
- Logs minimaux
- Volumes nommés
- Limites de ressources strictes
- Sécurité renforcée

---

## 🔒 Sécurité

### 1. Ne Pas Exécuter en Root

\`\`\`dockerfile
FROM node:20-alpine

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nodejs -u 1001

USER nodejs

WORKDIR /app
COPY --chown=nodejs:nodejs . .

CMD ["node", "server.js"]
\`\`\`

### 2. Scanner les Vulnérabilités

\`\`\`bash
# Avec Docker Scout
docker scout cves devflow-backend:latest

# Avec Trivy
trivy image devflow-backend:latest

# Avec Snyk
snyk container test devflow-backend:latest
\`\`\`

### 3. Utiliser des Images Officielles

\`\`\`dockerfile
# ✅ Bon : Image officielle
FROM node:20-alpine

# ❌ Mauvais : Image non vérifiée
FROM random-user/node
\`\`\`

### 4. Multi-stage Build

\`\`\`dockerfile
# Étape 1 : Build (avec outils de dev)
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 2 : Production (image minimale)
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
USER node
CMD ["node", "dist/main.js"]
\`\`\`

### 5. Secrets Management

\`\`\`bash
# Ne JAMAIS faire ça
ENV DB_PASSWORD=secret123  # ❌ Visible dans l'image

# Utiliser des secrets
docker run -d \\
  --env-file .env \\
  my-app

# Ou Docker secrets (Swarm)
docker secret create db_password ./password.txt
\`\`\`

---

## ⚡ Performance

### 1. Minimiser la Taille des Images

\`\`\`dockerfile
# ❌ Mauvais : 1.2 GB
FROM node:20
COPY . .
RUN npm install

# ✅ Bon : 150 MB
FROM node:20-alpine
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
\`\`\`

### 2. Optimiser les Layers

\`\`\`dockerfile
# Copier package.json d'abord (cache)
COPY package*.json ./
RUN npm ci

# Copier le code ensuite
COPY . .
RUN npm run build
\`\`\`

### 3. .dockerignore

\`\`\`
node_modules
npm-debug.log
.git
.env
*.md
dist
target
.vscode
.idea
coverage
.cache
\`\`\`

### 4. Limites de Ressources

\`\`\`yaml
# docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
\`\`\`

---

## 🏗️ Dockerfile Production

### Backend Spring Boot

\`\`\`dockerfile
# Multi-stage build optimisé
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Télécharger les dépendances (cache layer)
RUN ./mvnw dependency:go-offline

COPY src src

# Build avec tests
RUN ./mvnw clean package -DskipTests && \\
    mkdir -p target/dependency && \\
    cd target/dependency && \\
    jar -xf ../*.jar

# Image de production
FROM eclipse-temurin:17-jre-alpine

# Créer utilisateur non-root
RUN addgroup -g 1001 spring && \\
    adduser -S spring -u 1001

USER spring:spring

VOLUME /tmp

ARG DEPENDENCY=/workspace/app/target/dependency
COPY --from=build \${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build \${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build \${DEPENDENCY}/BOOT-INF/classes /app

# Health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \\
  CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

EXPOSE 8080

ENTRYPOINT ["java", \\
  "-XX:+UseContainerSupport", \\
  "-XX:MaxRAMPercentage=75.0", \\
  "-Djava.security.egd=file:/dev/./urandom", \\
  "-cp","app:app/lib/*", \\
  "com.example.DemoApplication"]
\`\`\`

### Frontend Angular

\`\`\`dockerfile
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm ci --only=production

# Build
COPY . .
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine

# Copier la config Nginx optimisée
COPY nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers buildés
COPY --from=build /app/dist/devflow /usr/share/nginx/html

# Permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \\
    chmod -R 755 /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \\
  CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
\`\`\`

---

## 📝 Logging

### Configuration Logging

\`\`\`yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
        labels: "production"
\`\`\`

### Centraliser les Logs

\`\`\`yaml
version: '3.8'

services:
  backend:
    logging:
      driver: "fluentd"
      options:
        fluentd-address: localhost:24224
        tag: backend

  fluentd:
    image: fluent/fluentd:latest
    ports:
      - "24224:24224"
    volumes:
      - ./fluent.conf:/fluentd/etc/fluent.conf
\`\`\`

---

## 🔄 CI/CD avec Docker

### GitHub Actions

\`\`\`yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_TOKEN }}

      - name: Build and push Backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: |
            username/devflow-backend:latest
            username/devflow-backend:\${{ github.sha }}
          cache-from: type=registry,ref=username/devflow-backend:buildcache
          cache-to: type=registry,ref=username/devflow-backend:buildcache,mode=max

      - name: Build and push Frontend
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: |
            username/devflow-frontend:latest
            username/devflow-frontend:\${{ github.sha }}
\`\`\`

---

## 🚀 Déploiement

### Sur un VPS

\`\`\`bash
# Sur le serveur de production
cd /opt/devflow

# Pull les dernières images
docker-compose pull

# Redémarrer avec les nouvelles images
docker-compose up -d --no-deps --build

# Vérifier le statut
docker-compose ps

# Voir les logs
docker-compose logs -f --tail=100
\`\`\`

### Script de Déploiement

\`\`\`bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Démarrage du déploiement..."

# Backup de la BDD
echo "📦 Backup de la base de données..."
docker-compose exec -T db pg_dump -U admin devflow > backup-\$(date +%Y%m%d-%H%M%S).sql

# Pull les nouvelles images
echo "⬇️ Récupération des images..."
docker-compose pull

# Arrêt gracieux
echo "🛑 Arrêt des services..."
docker-compose down

# Démarrage avec nouvelles images
echo "▶️ Démarrage des services..."
docker-compose up -d

# Attendre que les services soient prêts
echo "⏳ Attente des services..."
sleep 10

# Health check
echo "🏥 Vérification de la santé..."
docker-compose ps

# Nettoyage
echo "🧹 Nettoyage..."
docker image prune -f

echo "✅ Déploiement terminé !"
\`\`\`

---

## 🔍 Monitoring

### Prometheus + Grafana

\`\`\`yaml
services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    depends_on:
      - prometheus
    volumes:
      - grafana-data:/var/lib/grafana
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin

volumes:
  prometheus-data:
  grafana-data:
\`\`\`

---

## 📋 Checklist Production

### Sécurité
- [ ] Images scannées pour vulnérabilités
- [ ] Pas d'exécution en root
- [ ] Secrets gérés correctement
- [ ] Images officielles ou vérifiées
- [ ] TLS/HTTPS configuré

### Performance
- [ ] Multi-stage builds utilisés
- [ ] Images minimales (Alpine)
- [ ] .dockerignore configuré
- [ ] Limites de ressources définies
- [ ] Layers optimisés

### Fiabilité
- [ ] Health checks configurés
- [ ] Restart policy défini
- [ ] Logs centralisés
- [ ] Monitoring actif
- [ ] Backups automatisés

### Déploiement
- [ ] CI/CD configuré
- [ ] Scripts de déploiement testés
- [ ] Rollback plan défini
- [ ] Documentation à jour

---

## ⚠️ Erreurs à Éviter

### 1. Logs Non Gérés

\`\`\`yaml
# ✅ Limiter la taille des logs
services:
  backend:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
\`\`\`

### 2. Pas de Health Checks

\`\`\`yaml
# ✅ Toujours ajouter health check
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
  interval: 30s
  timeout: 10s
  retries: 3
\`\`\`

### 3. Volumes Non Sauvegardés

\`\`\`bash
# ✅ Automatiser les backups
0 2 * * * /opt/scripts/backup-volumes.sh
\`\`\`

---

## 🎯 Commandes Utiles Production

\`\`\`bash
# Voir l'utilisation des ressources
docker stats

# Nettoyer les ressources inutilisées
docker system prune -a --volumes

# Inspecter un conteneur
docker inspect <container>

# Exporter les logs
docker-compose logs > logs.txt

# Redémarrer un service sans downtime
docker-compose up -d --no-deps --build backend
\`\`\`
`
      },

      // =========================
      // CI/CD GUIDES
      // =========================

      {
        id: 'cicd-intro',
        title: 'Introduction à CI/CD',
        category: GuideCategory.CICD,
        icon: 'sync',
        color: '#10b981',
        order: 1,
        tags: ['CI/CD', 'DevOps', 'Automation', 'Pipeline'],
        lastUpdated: new Date(),
        content: `# Introduction à CI/CD 🔄

## 📌 Qu'est-ce que CI/CD ?

### Continuous Integration (CI)
L'**intégration continue** est une pratique qui consiste à fusionner fréquemment les modifications de code dans un dépôt central, où des builds et tests automatisés sont exécutés.

### Continuous Delivery/Deployment (CD)
Le **déploiement continu** automatise la livraison des applications vers les environnements de production après que les builds et tests aient réussi.

---

## 🎯 Avantages CI/CD

### Pour les Développeurs
- ✅ Détection rapide des bugs
- ✅ Feedback immédiat sur les changements
- ✅ Réduction des conflits de merge
- ✅ Code toujours dans un état déployable

### Pour l'Équipe
- ✅ Déploiements plus fréquents et fiables
- ✅ Réduction du temps de mise sur le marché
- ✅ Meilleure collaboration
- ✅ Documentation automatisée du processus

### Pour le Projet
- ✅ Qualité du code améliorée
- ✅ Coûts de maintenance réduits
- ✅ Traçabilité complète
- ✅ Rollback facilité

---

## 🏗️ Pipeline CI/CD Type

\`\`\`
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Code   │ -> │  Build  │ -> │  Test   │ -> │ Quality │ -> │ Deploy  │
│  Push   │    │         │    │         │    │  Check  │    │         │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
                    ↓              ↓              ↓              ↓
               Compilation    Unit Tests    SonarQube      Production
               Packaging      E2E Tests     Security       Staging
               Docker Build   Integration   Coverage       Dev
\`\`\`

---

## 🔧 Composants d'un Pipeline

### 1. Source Control
\`\`\`yaml
# Déclencheurs typiques
triggers:
  - push sur branches (main, develop, feature/*)
  - pull requests
  - tags (v1.0.0, release/*)
  - schedule (cron jobs)
  - manuel
\`\`\`

### 2. Build Stage
\`\`\`bash
# Backend Java/Spring Boot
./mvnw clean package -DskipTests

# Frontend Angular
npm ci
npm run build --configuration=production

# Docker
docker build -t myapp:latest .
\`\`\`

### 3. Test Stage
\`\`\`bash
# Tests unitaires
./mvnw test
npm run test:ci

# Tests E2E
npm run e2e

# Tests d'intégration
./mvnw verify -Pintegration-tests
\`\`\`

### 4. Quality Gate
\`\`\`bash
# Analyse SonarQube
./mvnw sonar:sonar

# Vérification de couverture
npm run test:coverage

# Audit de sécurité
npm audit
./mvnw dependency-check:check
\`\`\`

### 5. Deploy Stage
\`\`\`bash
# Build et push Docker images
docker build -t registry.com/app:$VERSION .
docker push registry.com/app:$VERSION

# Déploiement
kubectl apply -f k8s/
# ou
docker-compose up -d
\`\`\`

---

## 🛠️ Outils CI/CD Populaires

### Plateformes Cloud
- **GitHub Actions** - Intégré à GitHub, gratuit pour projets publics
- **GitLab CI/CD** - Intégré à GitLab, runners auto-hébergés
- **CircleCI** - Configuration simple, bonne performance
- **Travis CI** - Historique, moins utilisé maintenant

### Auto-hébergé
- **Jenkins** - Le plus ancien, très flexible, nécessite maintenance
- **TeamCity** - JetBrains, excellente intégration IntelliJ
- **Bamboo** - Atlassian, intégration Jira

### Comparaison

| Outil | Hébergement | Configuration | Coût | Popularité |
|-------|-------------|---------------|------|------------|
| GitHub Actions | Cloud | YAML | Gratuit (limites) | ⭐⭐⭐⭐⭐ |
| GitLab CI | Cloud/Self | YAML | Gratuit/Payant | ⭐⭐⭐⭐ |
| Jenkins | Self-hosted | UI/Groovy | Gratuit | ⭐⭐⭐⭐ |
| CircleCI | Cloud | YAML | Gratuit (limites) | ⭐⭐⭐ |

---

## 📋 Bonnes Pratiques CI/CD

### 1. Builds Rapides
\`\`\`yaml
# ✅ Paralléliser les jobs
jobs:
  backend-test:
    runs-on: ubuntu-latest
  frontend-test:
    runs-on: ubuntu-latest
  # Les deux s'exécutent en parallèle
\`\`\`

### 2. Cache Intelligent
\`\`\`yaml
# ✅ Cacher les dépendances
- name: Cache Maven
  uses: actions/cache@v3
  with:
    path: ~/.m2/repository
    key: \${{ runner.os }}-maven-\${{ hashFiles('**/pom.xml') }}

- name: Cache npm
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}
\`\`\`

### 3. Tests en Isolation
\`\`\`yaml
# ✅ Utiliser des containers de test
services:
  postgres:
    image: postgres:15
    env:
      POSTGRES_PASSWORD: test
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
\`\`\`

### 4. Versioning Sémantique
\`\`\`bash
# ✅ Utiliser des versions automatiques
VERSION=\${GITHUB_REF#refs/tags/}
# ou
VERSION=$(git describe --tags --always)
\`\`\`

### 5. Secrets Sécurisés
\`\`\`yaml
# ✅ Jamais de secrets en dur
env:
  DATABASE_URL: \${{ secrets.DATABASE_URL }}
  API_KEY: \${{ secrets.API_KEY }}
\`\`\`

---

## 🚀 Pipeline DevFlow Exemple

### Workflow Complet
\`\`\`yaml
name: DevFlow CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # 1. Tests Backend
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: Cache Maven
        uses: actions/cache@v3
        with:
          path: ~/.m2/repository
          key: maven-\${{ hashFiles('**/pom.xml') }}

      - name: Build and Test
        run: |
          cd backend
          ./mvnw clean verify

      - name: Upload Coverage
        uses: codecov/codecov-action@v3

  # 2. Tests Frontend
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Cache npm
        uses: actions/cache@v3
        with:
          path: ~/.npm
          key: npm-\${{ hashFiles('**/package-lock.json') }}

      - name: Install and Test
        run: |
          npm ci
          npm run test:ci
          npm run build --configuration=production

  # 3. Quality Gate
  sonarqube:
    needs: [backend, frontend]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: \${{ secrets.SONAR_HOST_URL }}

  # 4. Build Docker Images
  docker:
    needs: [backend, frontend, sonarqube]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_PASSWORD }}

      - name: Build and Push
        run: |
          docker build -t devflow/backend:latest ./backend
          docker build -t devflow/frontend:latest ./frontend
          docker push devflow/backend:latest
          docker push devflow/frontend:latest

  # 5. Deploy
  deploy:
    needs: [docker]
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Production
        run: |
          # SSH vers le serveur et redéploiement
          ssh user@server "cd /opt/devflow && docker-compose pull && docker-compose up -d"
\`\`\`

---

## ⚠️ Erreurs Courantes

### 1. Pipeline Trop Long
\`\`\`yaml
# ❌ Mauvais
- run: npm install  # Télécharge à chaque fois

# ✅ Bon
- uses: actions/cache@v3  # Cache les dépendances
\`\`\`

### 2. Tests Instables
\`\`\`typescript
// ❌ Mauvais - Tests qui échouent aléatoirement
it('should load data', async () => {
  setTimeout(() => expect(data).toBeDefined(), 100);
});

// ✅ Bon - Tests déterministes
it('should load data', async () => {
  await waitFor(() => expect(data).toBeDefined());
});
\`\`\`

### 3. Secrets Exposés
\`\`\`yaml
# ❌ JAMAIS ça
env:
  API_KEY: "mon-secret-1234"

# ✅ Toujours utiliser les secrets
env:
  API_KEY: \${{ secrets.API_KEY }}
\`\`\`

### 4. Pas de Rollback
\`\`\`yaml
# ✅ Toujours prévoir un rollback
deploy:
  steps:
    - name: Deploy
      run: ./deploy.sh

    - name: Health Check
      run: ./health-check.sh

    - name: Rollback on Failure
      if: failure()
      run: ./rollback.sh
\`\`\`

---

## 📊 Métriques CI/CD

### Indicateurs Clés
- **Build Time** - Temps de build moyen (objectif < 10 min)
- **Success Rate** - Taux de succès des builds (objectif > 95%)
- **Deployment Frequency** - Fréquence des déploiements
- **Lead Time** - Temps entre commit et production
- **MTTR** - Temps moyen de récupération après incident

### Dashboard Exemple
\`\`\`
📊 CI/CD Metrics (Last 30 days)
├─ Builds: 156 (98% success)
├─ Average Build Time: 8m 32s
├─ Deployments: 42
├─ Failed Deployments: 1 (2.4%)
└─ Average Lead Time: 2h 15m
\`\`\`

---

## 🎯 Checklist CI/CD

### Configuration Initiale
- [ ] Pipeline CI configuré
- [ ] Tests automatisés (unit, integration, E2E)
- [ ] Quality gate (SonarQube, coverage)
- [ ] Build Docker automatique
- [ ] Secrets configurés de manière sécurisée

### Optimisation
- [ ] Cache activé pour dépendances
- [ ] Jobs parallélisés
- [ ] Build time < 10 minutes
- [ ] Notifications configurées (Slack, Email)

### Production
- [ ] CD activé pour environnement de staging
- [ ] Déploiement manuel vers production (ou auto avec approbation)
- [ ] Health checks automatiques
- [ ] Rollback automatique si échec
- [ ] Monitoring post-déploiement

---

## 🔗 Ressources

### Documentation
- [GitHub Actions Docs](https://docs.github.com/actions)
- [GitLab CI/CD Docs](https://docs.gitlab.com/ee/ci/)
- [Jenkins Documentation](https://www.jenkins.io/doc/)

### Bonnes Pratiques
- [The Twelve-Factor App](https://12factor.net/)
- [CI/CD Best Practices](https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment)

---

**Prochaines étapes** : Découvrez comment mettre en place GitHub Actions dans le guide suivant !
`
      },

      {
        id: 'cicd-github-actions',
        title: 'GitHub Actions en Pratique',
        category: GuideCategory.CICD,
        icon: 'code',
        color: '#10b981',
        order: 2,
        tags: ['GitHub Actions', 'CI/CD', 'Automation', 'YAML'],
        lastUpdated: new Date(),
        content: `# GitHub Actions en Pratique 🚀

## 📌 Introduction

GitHub Actions est une plateforme CI/CD intégrée à GitHub qui permet d'automatiser le workflow de développement directement depuis votre dépôt.

---

## 🏗️ Structure d'un Workflow

### Emplacement
\`\`\`
projet/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── cd.yml
│       └── release.yml
\`\`\`

### Anatomie d'un Workflow
\`\`\`yaml
name: Mon Workflow             # Nom du workflow
on: [push, pull_request]       # Déclencheurs
jobs:                          # Jobs à exécuter
  build:                       # Nom du job
    runs-on: ubuntu-latest     # Environnement
    steps:                     # Étapes du job
      - uses: actions/checkout@v4    # Action à utiliser
      - name: Mon étape              # Nom de l'étape
        run: echo "Hello World"      # Commande à exécuter
\`\`\`

---

## 🔧 Configuration DevFlow

### 1. Workflow CI Complet

Créez \`.github/workflows/ci.yml\` :

\`\`\`yaml
name: DevFlow CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  JAVA_VERSION: '21'
  NODE_VERSION: '20'

jobs:
  # ==========================================
  # JOB 1: Tests Backend (Spring Boot)
  # ==========================================
  backend-tests:
    name: Backend Tests & Build
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_DB: devflow_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK \${{ env.JAVA_VERSION }}
        uses: actions/setup-java@v4
        with:
          java-version: \${{ env.JAVA_VERSION }}
          distribution: 'temurin'
          cache: 'maven'

      - name: Cache Maven packages
        uses: actions/cache@v3
        with:
          path: ~/.m2/repository
          key: \${{ runner.os }}-maven-\${{ hashFiles('**/pom.xml') }}
          restore-keys: |
            \${{ runner.os }}-maven-

      - name: Run Tests
        run: |
          cd backend
          ./mvnw clean test
        env:
          SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/devflow_test
          SPRING_DATASOURCE_USERNAME: test
          SPRING_DATASOURCE_PASSWORD: test

      - name: Build JAR
        run: |
          cd backend
          ./mvnw clean package -DskipTests

      - name: Generate Coverage Report
        run: |
          cd backend
          ./mvnw jacoco:report

      - name: Upload Coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/target/site/jacoco/jacoco.xml
          flags: backend
          name: backend-coverage

      - name: Upload JAR Artifact
        uses: actions/upload-artifact@v3
        with:
          name: backend-jar
          path: backend/target/*.jar
          retention-days: 7

  # ==========================================
  # JOB 2: Tests Frontend (Angular)
  # ==========================================
  frontend-tests:
    name: Frontend Tests & Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js \${{ env.NODE_VERSION }}
        uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Cache node modules
        uses: actions/cache@v3
        with:
          path: ~/.npm
          key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            \${{ runner.os }}-node-

      - name: Install Dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Unit Tests
        run: npm run test:ci

      - name: Build Production
        run: npm run build --configuration=production

      - name: Upload Coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: frontend
          name: frontend-coverage

      - name: Upload Build Artifact
        uses: actions/upload-artifact@v3
        with:
          name: frontend-dist
          path: dist/
          retention-days: 7

  # ==========================================
  # JOB 3: Tests E2E (Cypress)
  # ==========================================
  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [backend-tests, frontend-tests]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}

      - name: Download Frontend Build
        uses: actions/download-artifact@v3
        with:
          name: frontend-dist
          path: dist/

      - name: Cypress Run
        uses: cypress-io/github-action@v6
        with:
          start: npm run serve:dist
          wait-on: 'http://localhost:4200'
          wait-on-timeout: 120
          browser: chrome

      - name: Upload Cypress Screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-screenshots
          path: cypress/screenshots

      - name: Upload Cypress Videos
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-videos
          path: cypress/videos

  # ==========================================
  # JOB 4: SonarQube Analysis
  # ==========================================
  sonarqube:
    name: SonarQube Analysis
    runs-on: ubuntu-latest
    needs: [backend-tests, frontend-tests]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Shallow clones désactivés pour analyse

      - name: Set up JDK \${{ env.JAVA_VERSION }}
        uses: actions/setup-java@v4
        with:
          java-version: \${{ env.JAVA_VERSION }}
          distribution: 'temurin'

      - name: Cache SonarQube packages
        uses: actions/cache@v3
        with:
          path: ~/.sonar/cache
          key: \${{ runner.os }}-sonar

      - name: SonarQube Scan Backend
        env:
          SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: \${{ secrets.SONAR_HOST_URL }}
        run: |
          cd backend
          ./mvnw sonar:sonar \
            -Dsonar.projectKey=devflow-backend \
            -Dsonar.host.url=\${{ secrets.SONAR_HOST_URL }} \
            -Dsonar.token=\${{ secrets.SONAR_TOKEN }}

      - name: SonarQube Quality Gate
        uses: sonarsource/sonarqube-quality-gate-action@master
        timeout-minutes: 5
        env:
          SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}

  # ==========================================
  # JOB 5: Security Audit
  # ==========================================
  security-audit:
    name: Security Audit
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy Vulnerability Scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy Results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

      - name: NPM Audit
        run: npm audit --audit-level=moderate

      - name: Maven Dependency Check
        run: |
          cd backend
          ./mvnw dependency-check:check
\`\`\`

---

## 🚀 Workflow CD (Déploiement)

Créez \`.github/workflows/cd.yml\` :

\`\`\`yaml
name: DevFlow CD

on:
  push:
    branches:
      - main
    tags:
      - 'v*'

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  # ==========================================
  # Build et Push Docker Images
  # ==========================================
  docker-build:
    name: Build & Push Docker Images
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: \${{ env.REGISTRY }}
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata (tags, labels)
        id: meta-backend
        uses: docker/metadata-action@v5
        with:
          images: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}/backend

      - name: Build and Push Backend Image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: \${{ steps.meta-backend.outputs.tags }}
          labels: \${{ steps.meta-backend.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Extract metadata Frontend
        id: meta-frontend
        uses: docker/metadata-action@v5
        with:
          images: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}/frontend

      - name: Build and Push Frontend Image
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: \${{ steps.meta-frontend.outputs.tags }}
          labels: \${{ steps.meta-frontend.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ==========================================
  # Deploy to Staging
  # ==========================================
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: docker-build
    environment:
      name: staging
      url: https://staging.devflow.com

    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: \${{ secrets.STAGING_HOST }}
          username: \${{ secrets.STAGING_USER }}
          key: \${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /opt/devflow
            docker-compose pull
            docker-compose up -d
            docker system prune -f

      - name: Wait for Application
        run: sleep 30

      - name: Health Check
        run: |
          curl -f https://staging.devflow.com/health || exit 1

      - name: Smoke Tests
        run: |
          curl -f https://staging.devflow.com/api/health || exit 1

  # ==========================================
  # Deploy to Production (manual approval)
  # ==========================================
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: deploy-staging
    environment:
      name: production
      url: https://devflow.com
    if: startsWith(github.ref, 'refs/tags/v')

    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: \${{ secrets.PROD_HOST }}
          username: \${{ secrets.PROD_USER }}
          key: \${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /opt/devflow

            # Backup actuel
            docker-compose exec -T postgres pg_dump -U devflow devflow > backup-\$(date +%Y%m%d-%H%M%S).sql

            # Déploiement
            docker-compose pull
            docker-compose up -d --no-deps --build

            # Nettoyage
            docker image prune -f

      - name: Health Check Production
        run: |
          for i in {1..5}; do
            if curl -f https://devflow.com/health; then
              echo "Health check passed"
              exit 0
            fi
            echo "Retry \$i/5..."
            sleep 10
          done
          exit 1

      - name: Rollback on Failure
        if: failure()
        uses: appleboy/ssh-action@master
        with:
          host: \${{ secrets.PROD_HOST }}
          username: \${{ secrets.PROD_USER }}
          key: \${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /opt/devflow
            docker-compose down
            docker-compose up -d

      - name: Notify Deployment
        uses: 8398a7/action-slack@v3
        with:
          status: \${{ job.status }}
          text: 'Production deployment completed! 🚀'
          webhook_url: \${{ secrets.SLACK_WEBHOOK }}
\`\`\`

---

## 🔔 Workflow de Release

Créez \`.github/workflows/release.yml\` :

\`\`\`yaml
name: Create Release

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  release:
    name: Create GitHub Release
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Generate Changelog
        id: changelog
        uses: mikepenz/release-changelog-builder-action@v4
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          body: \${{ steps.changelog.outputs.changelog }}
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
\`\`\`

---

## 🔐 Configuration des Secrets

### Dans GitHub
1. Allez dans **Settings** → **Secrets and variables** → **Actions**
2. Ajoutez les secrets suivants :

\`\`\`
SONAR_TOKEN              # Token SonarQube
SONAR_HOST_URL           # URL SonarQube (ex: https://sonarcloud.io)
DOCKER_USERNAME          # Username Docker Hub
DOCKER_PASSWORD          # Password Docker Hub
STAGING_HOST             # IP du serveur staging
STAGING_USER             # User SSH staging
STAGING_SSH_KEY          # Clé privée SSH staging
PROD_HOST                # IP du serveur production
PROD_USER                # User SSH production
PROD_SSH_KEY             # Clé privée SSH production
SLACK_WEBHOOK            # Webhook Slack pour notifications
\`\`\`

---

## 🎨 Actions Personnalisées

### Action Réutilisable : Setup DevFlow

Créez \`.github/actions/setup-devflow/action.yml\` :

\`\`\`yaml
name: 'Setup DevFlow Environment'
description: 'Configure Java and Node.js for DevFlow'

inputs:
  java-version:
    description: 'Java version'
    required: false
    default: '21'
  node-version:
    description: 'Node.js version'
    required: false
    default: '20'

runs:
  using: 'composite'
  steps:
    - name: Set up JDK
      uses: actions/setup-java@v4
      with:
        java-version: \${{ inputs.java-version }}
        distribution: 'temurin'
        cache: 'maven'

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: \${{ inputs.node-version }}
        cache: 'npm'

    - name: Cache Maven
      uses: actions/cache@v3
      with:
        path: ~/.m2/repository
        key: maven-\${{ hashFiles('**/pom.xml') }}

    - name: Cache npm
      uses: actions/cache@v3
      with:
        path: ~/.npm
        key: npm-\${{ hashFiles('**/package-lock.json') }}
\`\`\`

### Utilisation
\`\`\`yaml
steps:
  - uses: ./.github/actions/setup-devflow
    with:
      java-version: '21'
      node-version: '20'
\`\`\`

---

## 📊 Badges de Status

Ajoutez dans votre \`README.md\` :

\`\`\`markdown
![CI](https://github.com/username/devflow/workflows/DevFlow%20CI/badge.svg)
![CD](https://github.com/username/devflow/workflows/DevFlow%20CD/badge.svg)
[![codecov](https://codecov.io/gh/username/devflow/branch/main/graph/badge.svg)](https://codecov.io/gh/username/devflow)
[![SonarQube](https://sonarcloud.io/api/project_badges/measure?project=devflow&metric=alert_status)](https://sonarcloud.io/dashboard?id=devflow)
\`\`\`

---

## ⚡ Optimisations

### 1. Matrix Strategy
\`\`\`yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node: [18, 20]
    runs-on: \${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
\`\`\`

### 2. Conditional Jobs
\`\`\`yaml
jobs:
  deploy:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - name: Deploy
        run: ./deploy.sh
\`\`\`

### 3. Reusable Workflows
\`\`\`yaml
# .github/workflows/reusable-tests.yml
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Testing on \${{ inputs.environment }}"

# Utilisation
jobs:
  call-tests:
    uses: ./.github/workflows/reusable-tests.yml
    with:
      environment: staging
\`\`\`

---

## 🐛 Debugging

### Activer le mode debug
\`\`\`yaml
- name: Debug Info
  run: |
    echo "Event name: \${{ github.event_name }}"
    echo "Ref: \${{ github.ref }}"
    echo "Actor: \${{ github.actor }}"
\`\`\`

### Tmate pour debugging interactif
\`\`\`yaml
- name: Setup tmate session
  if: failure()
  uses: mxschmitt/action-tmate@v3
  timeout-minutes: 15
\`\`\`

---

## 📋 Checklist Workflow

### Avant de Merge
- [ ] Tous les tests passent
- [ ] Coverage > 80%
- [ ] SonarQube Quality Gate OK
- [ ] Pas de vulnerabilités critiques
- [ ] Build Docker réussit

### Production
- [ ] Tag sémantique créé (v1.2.3)
- [ ] Release notes générées
- [ ] Backup base de données effectué
- [ ] Health checks configurés
- [ ] Rollback plan testé

---

## 🎯 Commandes Utiles

\`\`\`bash
# Tester workflow localement avec act
act -j backend-tests

# Lister les workflows
gh workflow list

# Voir les runs d'un workflow
gh run list --workflow=ci.yml

# Re-run un workflow qui a échoué
gh run rerun <run-id>

# Télécharger les artifacts
gh run download <run-id>
\`\`\`

---

**GitHub Actions** offre une intégration native puissante avec un écosystème riche d'actions réutilisables ! 🎯
`
      },

      {
        id: 'cicd-gitlab-jenkins',
        title: 'GitLab CI & Jenkins',
        category: GuideCategory.CICD,
        icon: 'settings',
        color: '#10b981',
        order: 3,
        tags: ['GitLab CI', 'Jenkins', 'CI/CD', 'DevOps'],
        lastUpdated: new Date(),
        content: `# GitLab CI & Jenkins ⚙️

## 📌 Introduction

Ce guide présente deux alternatives puissantes à GitHub Actions : **GitLab CI/CD** (SaaS ou auto-hébergé) et **Jenkins** (auto-hébergé, très flexible).

---

## 🦊 GitLab CI/CD

### Avantages
- ✅ Intégré nativement à GitLab
- ✅ Configuration YAML simple
- ✅ Runners auto-hébergés gratuits
- ✅ Registry Docker intégré
- ✅ Excellent pour monorepos

### Architecture
\`\`\`
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  GitLab     │ ───> │   Runner    │ ───> │   Docker    │
│  Server     │      │  (Executor) │      │  Container  │
└─────────────┘      └─────────────┘      └─────────────┘
\`\`\`

---

## 🚀 Configuration GitLab CI

### Fichier \`.gitlab-ci.yml\`

\`\`\`yaml
# Variables globales
variables:
  MAVEN_OPTS: "-Dmaven.repo.local=.m2/repository"
  DOCKER_DRIVER: overlay2
  POSTGRES_DB: devflow_test
  POSTGRES_USER: test
  POSTGRES_PASSWORD: test

# Stages du pipeline
stages:
  - build
  - test
  - quality
  - package
  - deploy

# Templates réutilisables
.java_template: &java_setup
  image: eclipse-temurin:21-jdk
  cache:
    key: "\${CI_COMMIT_REF_SLUG}-maven"
    paths:
      - .m2/repository/
      - backend/target/

.node_template: &node_setup
  image: node:20-alpine
  cache:
    key: "\${CI_COMMIT_REF_SLUG}-npm"
    paths:
      - node_modules/
      - .npm/

# ==========================================
# BUILD STAGE
# ==========================================
build:backend:
  <<: *java_setup
  stage: build
  script:
    - cd backend
    - ./mvnw clean compile
  artifacts:
    paths:
      - backend/target/
    expire_in: 1 hour

build:frontend:
  <<: *node_setup
  stage: build
  script:
    - npm ci
    - npm run build --configuration=production
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

# ==========================================
# TEST STAGE
# ==========================================
test:backend:
  <<: *java_setup
  stage: test
  needs: ["build:backend"]
  services:
    - postgres:15-alpine
  variables:
    SPRING_DATASOURCE_URL: "jdbc:postgresql://postgres:5432/devflow_test"
    SPRING_DATASOURCE_USERNAME: test
    SPRING_DATASOURCE_PASSWORD: test
  script:
    - cd backend
    - ./mvnw test
    - ./mvnw jacoco:report
  coverage: '/Total.*?([0-9]{1,3})%/'
  artifacts:
    reports:
      junit: backend/target/surefire-reports/TEST-*.xml
      coverage_report:
        coverage_format: cobertura
        path: backend/target/site/jacoco/jacoco.xml
    paths:
      - backend/target/site/jacoco/
    expire_in: 7 days

test:frontend:
  <<: *node_setup
  stage: test
  needs: ["build:frontend"]
  script:
    - npm run test:ci
  coverage: '/Lines\\s*:\\s*(\\d+\\.\\d+)%/'
  artifacts:
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    paths:
      - coverage/
    expire_in: 7 days

test:e2e:
  <<: *node_setup
  stage: test
  needs: ["build:frontend"]
  services:
    - name: cypress/browsers:node20.11.0-chrome121.0.6167.85-1-ff120.0-edge121.0.2277.83-1
      alias: cypress
  script:
    - npm run e2e:ci
  artifacts:
    when: on_failure
    paths:
      - cypress/screenshots/
      - cypress/videos/
    expire_in: 7 days

# ==========================================
# QUALITY STAGE
# ==========================================
sonarqube:
  image: maven:3.9-eclipse-temurin-21
  stage: quality
  needs: ["test:backend", "test:frontend"]
  variables:
    SONAR_USER_HOME: "\${CI_PROJECT_DIR}/.sonar"
    GIT_DEPTH: "0"
  cache:
    key: "\${CI_JOB_NAME}"
    paths:
      - .sonar/cache
  script:
    - cd backend
    - mvn sonar:sonar
      -Dsonar.projectKey=devflow
      -Dsonar.host.url=\$SONAR_HOST_URL
      -Dsonar.token=\$SONAR_TOKEN
      -Dsonar.qualitygate.wait=true
  only:
    - main
    - develop
    - merge_requests

security:scan:
  image: aquasec/trivy:latest
  stage: quality
  script:
    - trivy fs --exit-code 0 --no-progress --format json -o trivy-report.json .
    - trivy fs --exit-code 1 --severity CRITICAL --no-progress .
  artifacts:
    reports:
      container_scanning: trivy-report.json
    expire_in: 7 days
  allow_failure: true

# ==========================================
# PACKAGE STAGE (Docker)
# ==========================================
docker:backend:
  stage: package
  image: docker:24-dind
  services:
    - docker:24-dind
  needs: ["test:backend", "sonarqube"]
  before_script:
    - docker login -u \$CI_REGISTRY_USER -p \$CI_REGISTRY_PASSWORD \$CI_REGISTRY
  script:
    - cd backend
    - docker build -t \$CI_REGISTRY_IMAGE/backend:\$CI_COMMIT_SHORT_SHA .
    - docker build -t \$CI_REGISTRY_IMAGE/backend:latest .
    - docker push \$CI_REGISTRY_IMAGE/backend:\$CI_COMMIT_SHORT_SHA
    - docker push \$CI_REGISTRY_IMAGE/backend:latest
  only:
    - main
    - develop

docker:frontend:
  stage: package
  image: docker:24-dind
  services:
    - docker:24-dind
  needs: ["test:frontend"]
  before_script:
    - docker login -u \$CI_REGISTRY_USER -p \$CI_REGISTRY_PASSWORD \$CI_REGISTRY
  script:
    - docker build -t \$CI_REGISTRY_IMAGE/frontend:\$CI_COMMIT_SHORT_SHA .
    - docker build -t \$CI_REGISTRY_IMAGE/frontend:latest .
    - docker push \$CI_REGISTRY_IMAGE/frontend:\$CI_COMMIT_SHORT_SHA
    - docker push \$CI_REGISTRY_IMAGE/frontend:latest
  only:
    - main
    - develop

# ==========================================
# DEPLOY STAGE
# ==========================================
deploy:staging:
  stage: deploy
  image: alpine:latest
  needs: ["docker:backend", "docker:frontend"]
  environment:
    name: staging
    url: https://staging.devflow.com
  before_script:
    - apk add --no-cache openssh-client
    - eval \$(ssh-agent -s)
    - echo "\$SSH_PRIVATE_KEY" | tr -d '\\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan \$STAGING_HOST >> ~/.ssh/known_hosts
  script:
    - |
      ssh \$STAGING_USER@\$STAGING_HOST << 'EOF'
        cd /opt/devflow
        docker-compose pull
        docker-compose up -d
        docker system prune -f
      EOF
    - sleep 30
    - wget --retry-connrefused --tries=10 --waitretry=3 https://staging.devflow.com/health
  only:
    - develop

deploy:production:
  stage: deploy
  image: alpine:latest
  needs: ["docker:backend", "docker:frontend"]
  environment:
    name: production
    url: https://devflow.com
  before_script:
    - apk add --no-cache openssh-client curl
    - eval \$(ssh-agent -s)
    - echo "\$SSH_PRIVATE_KEY" | tr -d '\\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan \$PROD_HOST >> ~/.ssh/known_hosts
  script:
    - |
      ssh \$PROD_USER@\$PROD_HOST << 'EOF'
        cd /opt/devflow

        # Backup
        docker-compose exec -T postgres pg_dump -U devflow devflow > backup-\$(date +%Y%m%d-%H%M%S).sql

        # Deploy
        docker-compose pull
        docker-compose up -d --no-deps

        # Health check
        sleep 20
        curl -f https://devflow.com/health || exit 1

        # Cleanup
        docker image prune -f
      EOF
  when: manual
  only:
    - main
    - tags

# ==========================================
# Rollback Manuel
# ==========================================
rollback:production:
  stage: deploy
  image: alpine:latest
  environment:
    name: production
    url: https://devflow.com
  before_script:
    - apk add --no-cache openssh-client
    - eval \$(ssh-agent -s)
    - echo "\$SSH_PRIVATE_KEY" | tr -d '\\r' | ssh-add -
  script:
    - |
      ssh \$PROD_USER@\$PROD_HOST << 'EOF'
        cd /opt/devflow
        docker-compose down
        docker-compose up -d
      EOF
  when: manual
  only:
    - main
\`\`\`

---

## 🔧 GitLab Runner Installation

### Sur un serveur Linux

\`\`\`bash
# 1. Ajouter le repo GitLab
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash

# 2. Installer GitLab Runner
sudo apt-get install gitlab-runner

# 3. Enregistrer le runner
sudo gitlab-runner register

# Informations à fournir:
# - GitLab URL: https://gitlab.com/
# - Token: (depuis Settings > CI/CD > Runners)
# - Description: devflow-runner
# - Tags: docker, linux
# - Executor: docker
# - Default image: alpine:latest

# 4. Vérifier le statut
sudo gitlab-runner status
\`\`\`

### Docker Executor Configuration

\`\`\`toml
# /etc/gitlab-runner/config.toml
concurrent = 4
check_interval = 0

[[runners]]
  name = "devflow-runner"
  url = "https://gitlab.com/"
  token = "YOUR_TOKEN"
  executor = "docker"
  [runners.docker]
    image = "alpine:latest"
    privileged = true
    volumes = ["/cache", "/var/run/docker.sock:/var/run/docker.sock"]
    pull_policy = "if-not-present"
  [runners.cache]
    Type = "s3"
    Shared = true
\`\`\`

---

## 🏗️ Jenkins

### Avantages
- ✅ Ultra-flexible avec 1800+ plugins
- ✅ Pipeline as Code (Jenkinsfile)
- ✅ Support multi-branch
- ✅ Blue Ocean UI moderne
- ✅ Gratuit et open-source

### Installation Docker

\`\`\`yaml
# docker-compose.yml pour Jenkins
version: '3.8'

services:
  jenkins:
    image: jenkins/jenkins:lts-jdk21
    container_name: jenkins
    privileged: true
    user: root
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins-data:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
      - /usr/bin/docker:/usr/bin/docker
    environment:
      - JAVA_OPTS=-Djenkins.install.runSetupWizard=false
      - CASC_JENKINS_CONFIG=/var/jenkins_home/casc.yaml

volumes:
  jenkins-data:
\`\`\`

\`\`\`bash
# Démarrer Jenkins
docker-compose up -d

# Récupérer le mot de passe initial
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# Accéder à http://localhost:8080
\`\`\`

---

## 📝 Jenkinsfile pour DevFlow

### Pipeline Déclaratif

\`\`\`groovy
pipeline {
    agent any

    environment {
        JAVA_HOME = tool 'JDK21'
        MAVEN_HOME = tool 'Maven3.9'
        NODE_HOME = tool 'NodeJS20'
        PATH = "\${JAVA_HOME}/bin:\${MAVEN_HOME}/bin:\${NODE_HOME}/bin:\${PATH}"

        DOCKER_REGISTRY = 'registry.devflow.com'
        DOCKER_CREDENTIALS = credentials('docker-registry-creds')
        SONAR_TOKEN = credentials('sonarqube-token')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage('Build & Test Backend') {
            agent {
                docker {
                    image 'eclipse-temurin:21-jdk'
                    args '-v $HOME/.m2:/root/.m2'
                }
            }
            steps {
                dir('backend') {
                    sh '''
                        ./mvnw clean verify
                        ./mvnw jacoco:report
                    '''
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                    jacoco(
                        execPattern: 'backend/target/jacoco.exec',
                        classPattern: 'backend/target/classes',
                        sourcePattern: 'backend/src/main/java'
                    )
                }
            }
        }

        stage('Build & Test Frontend') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '-v $HOME/.npm:/root/.npm'
                }
            }
            steps {
                sh '''
                    npm ci
                    npm run lint
                    npm run test:ci
                    npm run build --configuration=production
                '''
            }
            post {
                always {
                    publishHTML([
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                dir('backend') {
                    withSonarQubeEnv('SonarQube') {
                        sh '''
                            ./mvnw sonar:sonar \
                                -Dsonar.projectKey=devflow \
                                -Dsonar.host.url=$SONAR_HOST_URL \
                                -Dsonar.token=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Docker Images') {
            when {
                branch 'main'
            }
            parallel {
                stage('Backend Image') {
                    steps {
                        dir('backend') {
                            script {
                                docker.withRegistry("https://\${DOCKER_REGISTRY}", 'docker-registry-creds') {
                                    def backendImage = docker.build("devflow/backend:\${GIT_COMMIT_SHORT}")
                                    backendImage.push()
                                    backendImage.push('latest')
                                }
                            }
                        }
                    }
                }
                stage('Frontend Image') {
                    steps {
                        script {
                            docker.withRegistry("https://\${DOCKER_REGISTRY}", 'docker-registry-creds') {
                                def frontendImage = docker.build("devflow/frontend:\${GIT_COMMIT_SHORT}")
                                frontendImage.push()
                                frontendImage.push('latest')
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                sshagent(['staging-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no user@staging.devflow.com << 'EOF'
                            cd /opt/devflow
                            docker-compose pull
                            docker-compose up -d
                            docker system prune -f
                        EOF
                    '''
                }

                // Health check
                sh 'curl -f https://staging.devflow.com/health'
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'

                sshagent(['production-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no user@devflow.com << 'EOF'
                            cd /opt/devflow

                            # Backup
                            docker-compose exec -T postgres pg_dump -U devflow devflow > backup-$(date +%Y%m%d-%H%M%S).sql

                            # Deploy
                            docker-compose pull
                            docker-compose up -d --no-deps

                            # Health check
                            sleep 20
                            curl -f https://devflow.com/health || exit 1

                            # Cleanup
                            docker image prune -f
                        EOF
                    '''
                }
            }
        }
    }

    post {
        success {
            slackSend(
                color: 'good',
                message: "Build SUCCESS: \${env.JOB_NAME} #\${env.BUILD_NUMBER}"
            )
        }
        failure {
            slackSend(
                color: 'danger',
                message: "Build FAILED: \${env.JOB_NAME} #\${env.BUILD_NUMBER}"
            )
        }
        always {
            cleanWs()
        }
    }
}
\`\`\`

---

## 🔌 Plugins Jenkins Essentiels

### Installation via UI
1. **Manage Jenkins** → **Plugins** → **Available plugins**

### Plugins Recommandés
\`\`\`
# Pipeline & SCM
- Pipeline
- Pipeline: Declarative
- Git plugin
- GitHub Integration
- GitLab Plugin

# Build Tools
- Maven Integration
- NodeJS Plugin
- Docker Pipeline

# Quality & Testing
- JUnit Plugin
- JaCoCo Plugin
- SonarQube Scanner
- HTML Publisher

# Deployment
- SSH Agent
- Publish Over SSH

# Notifications
- Slack Notification
- Email Extension

# UI
- Blue Ocean
- Dashboard View
\`\`\`

---

## 📊 Comparaison

| Fonctionnalité | GitHub Actions | GitLab CI | Jenkins |
|----------------|----------------|-----------|---------|
| **Hébergement** | Cloud uniquement | Cloud + Self | Self uniquement |
| **Configuration** | YAML | YAML | Groovy/YAML |
| **UI** | Basique | Excellente | Blue Ocean (bon) |
| **Courbe d'apprentissage** | Facile | Facile | Moyenne |
| **Coût** | Gratuit (limites) | Gratuit (limites) | Gratuit |
| **Runners** | Managed | Managed + Self | Self uniquement |
| **Écosystème** | GitHub Marketplace | GitLab Registry | 1800+ plugins |
| **Multi-repo** | Limité | Excellent | Excellent |
| **Artifacts** | Oui | Oui (Registry) | Oui |

---

## 🎯 Quelle Solution Choisir ?

### GitHub Actions si :
- ✅ Vous êtes sur GitHub
- ✅ Vous voulez une solution simple et rapide
- ✅ Vous n'avez pas besoin de runners auto-hébergés
- ✅ Projet open-source (gratuit illimité)

### GitLab CI si :
- ✅ Vous êtes sur GitLab
- ✅ Vous voulez auto-héberger
- ✅ Vous travaillez sur un monorepo
- ✅ Vous voulez un Registry Docker intégré

### Jenkins si :
- ✅ Vous avez besoin de flexibilité maximale
- ✅ Vous avez des besoins complexes
- ✅ Vous voulez tout contrôler
- ✅ Vous avez une équipe DevOps dédiée

---

## 🔐 Sécurité CI/CD

### Bonnes Pratiques
\`\`\`yaml
# 1. Utiliser des secrets chiffrés
variables:
  DB_PASSWORD:
    vault: production/db/password

# 2. Scanner les images Docker
script:
  - trivy image \$IMAGE_NAME

# 3. Signer les artifacts
script:
  - cosign sign \$IMAGE_NAME

# 4. Limiter les permissions
permissions:
  contents: read
  packages: write

# 5. Auditer les accès
script:
  - git log --all --oneline | tee audit.log
\`\`\`

---

## 📋 Checklist Migration

### De GitHub Actions vers GitLab CI
- [ ] Convertir \`.github/workflows/*.yml\` en \`.gitlab-ci.yml\`
- [ ] Migrer les secrets vers GitLab CI/CD Variables
- [ ] Installer et enregistrer GitLab Runners
- [ ] Adapter les actions GitHub en scripts
- [ ] Tester les pipelines sur une branche de test

### De GitLab CI vers Jenkins
- [ ] Installer Jenkins et plugins nécessaires
- [ ] Convertir \`.gitlab-ci.yml\` en \`Jenkinsfile\`
- [ ] Configurer les credentials Jenkins
- [ ] Créer les jobs multibranch
- [ ] Configurer les webhooks GitLab → Jenkins

---

**Choisissez l'outil qui correspond le mieux à vos besoins et à votre stack ! 🎯**
`
      },

      // =========================
      // DEPLOYMENT GUIDES
      // =========================

      {
        id: 'deployment-vps',
        title: 'Déploiement sur VPS',
        category: GuideCategory.DEPLOYMENT,
        icon: 'cloud_upload',
        color: '#f59e0b',
        order: 1,
        tags: ['VPS', 'Linux', 'Nginx', 'Production'],
        lastUpdated: new Date(),
        content: `# Déploiement sur VPS 🚀

## 📌 Introduction

Déployer DevFlow sur un **VPS** (Virtual Private Server) vous donne un contrôle total sur votre infrastructure. Ce guide couvre le déploiement sur Ubuntu/Debian avec Docker, Nginx et SSL.

---

## 🖥️ Prérequis VPS

### Spécifications Minimales
\`\`\`
CPU: 2 cores
RAM: 4 GB
Stockage: 40 GB SSD
OS: Ubuntu 22.04 LTS ou Debian 12
\`\`\`

### Spécifications Recommandées
\`\`\`
CPU: 4 cores
RAM: 8 GB
Stockage: 80 GB SSD
Bande passante: Illimitée
\`\`\`

### Fournisseurs VPS Populaires
- **DigitalOcean** - Droplets, simple, interface claire ($6-12/mois)
- **Hetzner** - Excellent rapport qualité/prix (€4-8/mois)
- **OVH** - Serveurs en Europe (€3-6/mois)
- **Linode** - Très stable, bon support ($5-10/mois)
- **Vultr** - Réseau mondial ($5-10/mois)

---

## 🔧 Configuration Initiale du Serveur

### 1. Connexion SSH

\`\`\`bash
# Connexion en tant que root
ssh root@your-server-ip

# Ou avec une clé SSH
ssh -i ~/.ssh/id_rsa root@your-server-ip
\`\`\`

### 2. Mise à Jour Système

\`\`\`bash
# Mettre à jour les packages
apt update && apt upgrade -y

# Installer les outils essentiels
apt install -y curl wget git vim ufw fail2ban
\`\`\`

### 3. Créer un Utilisateur Non-Root

\`\`\`bash
# Créer un nouvel utilisateur
adduser devflow

# Ajouter aux sudoers
usermod -aG sudo devflow

# Copier les clés SSH (si utilisées)
rsync --archive --chown=devflow:devflow ~/.ssh /home/devflow
\`\`\`

### 4. Configuration du Pare-feu

\`\`\`bash
# Autoriser SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Activer le pare-feu
ufw enable

# Vérifier le statut
ufw status
\`\`\`

---

## 🐳 Installation Docker

\`\`\`bash
# Se connecter avec l'utilisateur devflow
su - devflow

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker devflow

# Installer Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Vérifier les installations
docker --version
docker-compose --version

# IMPORTANT: Se déconnecter et reconnecter pour appliquer les changements de groupe
exit
su - devflow
\`\`\`

---

## 📁 Structure du Projet sur le Serveur

\`\`\`bash
# Créer la structure
mkdir -p /opt/devflow
cd /opt/devflow

# Cloner le projet (si GitHub)
git clone https://github.com/votre-username/devflow.git .

# Ou créer manuellement la structure
mkdir -p backend frontend nginx
\`\`\`

---

## 🔐 Configuration Nginx

### 1. Installer Nginx

\`\`\`bash
sudo apt install -y nginx
\`\`\`

### 2. Configuration Nginx pour DevFlow

Créez \`/etc/nginx/sites-available/devflow\` :

\`\`\`nginx
# Redirection HTTP -> HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name devflow.com www.devflow.com;

    # Certbot challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirection vers HTTPS
    location / {
        return 301 https://\$host\$request_uri;
    }
}

# HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name devflow.com www.devflow.com;

    # Certificats SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/devflow.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/devflow.com/privkey.pem;

    # Configuration SSL moderne
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Frontend Angular
    location / {
        proxy_pass http://localhost:4200;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Timeouts pour requêtes longues
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:8080/health;
        access_log off;
    }

    # Logs
    access_log /var/log/nginx/devflow-access.log;
    error_log /var/log/nginx/devflow-error.log;
}
\`\`\`

### 3. Activer la Configuration

\`\`\`bash
# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/devflow /etc/nginx/sites-enabled/

# Supprimer le site par défaut
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
\`\`\`

---

## 🔒 Configuration SSL avec Let's Encrypt

\`\`\`bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir un certificat SSL
sudo certbot --nginx -d devflow.com -d www.devflow.com

# Le certificat sera automatiquement renouvelé
# Vérifier le renouvellement automatique
sudo systemctl status certbot.timer

# Test du renouvellement
sudo certbot renew --dry-run
\`\`\`

---

## 🚀 Déploiement de l'Application

### 1. Docker Compose Production

Créez \`/opt/devflow/docker-compose.prod.yml\` :

\`\`\`yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: devflow-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: devflow
      POSTGRES_USER: devflow
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "127.0.0.1:5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devflow"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    image: ghcr.io/votre-username/devflow-backend:latest
    container_name: devflow-backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/devflow
      SPRING_DATASOURCE_USERNAME: devflow
      SPRING_DATASOURCE_PASSWORD: \${DB_PASSWORD}
      JWT_SECRET: \${JWT_SECRET}
    ports:
      - "127.0.0.1:8080:8080"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    image: ghcr.io/votre-username/devflow-frontend:latest
    container_name: devflow-frontend
    restart: unless-stopped
    depends_on:
      - backend
    environment:
      API_URL: https://devflow.com/api
    ports:
      - "127.0.0.1:4200:80"

volumes:
  postgres-data:
\`\`\`

### 2. Fichier .env

Créez \`/opt/devflow/.env\` :

\`\`\`bash
# Database
DB_PASSWORD=your-super-secure-password-here

# JWT
JWT_SECRET=your-jwt-secret-min-32-chars-long

# Application
NODE_ENV=production
SPRING_PROFILES_ACTIVE=prod
\`\`\`

**Important** : Sécurisez le fichier .env !

\`\`\`bash
chmod 600 /opt/devflow/.env
\`\`\`

### 3. Démarrer l'Application

\`\`\`bash
cd /opt/devflow

# Pull des dernières images
docker-compose -f docker-compose.prod.yml pull

# Démarrer les services
docker-compose -f docker-compose.prod.yml up -d

# Vérifier les logs
docker-compose -f docker-compose.prod.yml logs -f

# Vérifier le statut
docker-compose -f docker-compose.prod.yml ps
\`\`\`

---

## 📊 Scripts de Gestion

### Script de Déploiement

Créez \`/opt/devflow/deploy.sh\` :

\`\`\`bash
#!/bin/bash
set -e

echo "🚀 DevFlow Deployment Script"
echo "=============================="

# Variables
COMPOSE_FILE="docker-compose.prod.yml"
BACKUP_DIR="/opt/devflow/backups"
DATE=\$(date +%Y%m%d-%H%M%S)

# Backup de la base de données
echo "📦 Creating database backup..."
docker-compose -f \$COMPOSE_FILE exec -T postgres pg_dump -U devflow devflow > \$BACKUP_DIR/backup-\$DATE.sql
echo "✅ Backup saved: backup-\$DATE.sql"

# Pull des nouvelles images
echo "⬇️  Pulling latest images..."
docker-compose -f \$COMPOSE_FILE pull

# Arrêt des anciens containers
echo "🛑 Stopping old containers..."
docker-compose -f \$COMPOSE_FILE down

# Démarrage des nouveaux containers
echo "▶️  Starting new containers..."
docker-compose -f \$COMPOSE_FILE up -d

# Attendre que l'application soit prête
echo "⏳ Waiting for application to be ready..."
sleep 20

# Health check
echo "🏥 Running health check..."
if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ Application is healthy!"
else
    echo "❌ Health check failed! Rolling back..."
    docker-compose -f \$COMPOSE_FILE down
    docker-compose -f \$COMPOSE_FILE up -d
    exit 1
fi

# Nettoyage
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "🎉 Deployment completed successfully!"
\`\`\`

\`\`\`bash
# Rendre le script exécutable
chmod +x /opt/devflow/deploy.sh
\`\`\`

### Script de Backup

Créez \`/opt/devflow/backup.sh\` :

\`\`\`bash
#!/bin/bash
set -e

BACKUP_DIR="/opt/devflow/backups"
DATE=\$(date +%Y%m%d-%H%M%S)
RETENTION_DAYS=7

# Créer le dossier de backup
mkdir -p \$BACKUP_DIR

# Backup PostgreSQL
echo "📦 Backing up database..."
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U devflow devflow | gzip > \$BACKUP_DIR/db-backup-\$DATE.sql.gz

# Supprimer les backups de plus de 7 jours
echo "🧹 Cleaning old backups..."
find \$BACKUP_DIR -name "db-backup-*.sql.gz" -mtime +\$RETENTION_DAYS -delete

echo "✅ Backup completed: db-backup-\$DATE.sql.gz"
\`\`\`

\`\`\`bash
chmod +x /opt/devflow/backup.sh
\`\`\`

### Automatiser les Backups avec Cron

\`\`\`bash
# Éditer crontab
crontab -e

# Ajouter cette ligne pour un backup quotidien à 2h du matin
0 2 * * * /opt/devflow/backup.sh >> /var/log/devflow-backup.log 2>&1
\`\`\`

---

## 🔄 Mise à Jour de l'Application

\`\`\`bash
# Méthode simple
cd /opt/devflow
./deploy.sh

# Méthode manuelle
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d --no-deps backend frontend
\`\`\`

---

## 🐛 Troubleshooting

### Vérifier les Logs

\`\`\`bash
# Logs de tous les services
docker-compose -f docker-compose.prod.yml logs -f

# Logs d'un service spécifique
docker-compose -f docker-compose.prod.yml logs -f backend

# Logs Nginx
sudo tail -f /var/log/nginx/devflow-error.log
\`\`\`

### Vérifier l'État des Services

\`\`\`bash
# Status Docker
docker-compose -f docker-compose.prod.yml ps

# Status Nginx
sudo systemctl status nginx

# Ports ouverts
sudo netstat -tlnp
\`\`\`

### Redémarrer les Services

\`\`\`bash
# Redémarrer un service Docker
docker-compose -f docker-compose.prod.yml restart backend

# Redémarrer Nginx
sudo systemctl restart nginx

# Redémarrer tout
docker-compose -f docker-compose.prod.yml restart
\`\`\`

---

## 📋 Checklist Déploiement

### Avant le Premier Déploiement
- [ ] VPS créé et accessible via SSH
- [ ] Nom de domaine configuré (DNS A record)
- [ ] Utilisateur non-root créé
- [ ] Pare-feu configuré
- [ ] Docker et Docker Compose installés
- [ ] Nginx installé et configuré
- [ ] Certificat SSL obtenu
- [ ] Variables d'environnement configurées
- [ ] Fichier .env sécurisé

### Après Chaque Déploiement
- [ ] Health check réussi
- [ ] Backup de la base de données effectué
- [ ] Logs vérifiés
- [ ] SSL/HTTPS fonctionnel
- [ ] Performance acceptable
- [ ] Anciens containers/images nettoyés

---

## 🎯 Optimisations Production

### 1. Swap (si RAM limitée)

\`\`\`bash
# Créer un fichier swap de 2GB
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Rendre permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
\`\`\`

### 2. Limiter les Ressources Docker

\`\`\`yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
\`\`\`

### 3. Logs Rotation

\`\`\`yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
\`\`\`

---

**Votre application DevFlow est maintenant déployée en production sur votre VPS ! 🎉**
`
      },

      {
        id: 'deployment-cloud',
        title: 'Déploiement Cloud (AWS, Azure, GCP)',
        category: GuideCategory.DEPLOYMENT,
        icon: 'cloud',
        color: '#f59e0b',
        order: 2,
        tags: ['AWS', 'Azure', 'GCP', 'Cloud', 'Kubernetes'],
        lastUpdated: new Date(),
        content: `# Déploiement Cloud ☁️

## 📌 Introduction

Ce guide couvre le déploiement de DevFlow sur les **3 principaux fournisseurs cloud** : AWS, Azure et GCP. Nous explorons plusieurs options : conteneurs managés, Kubernetes, et services serverless.

---

## ☁️ Comparaison des Plateformes

| Critère | AWS | Azure | GCP |
|---------|-----|-------|-----|
| **Part de marché** | 32% | 23% | 10% |
| **Services** | 200+ | 200+ | 100+ |
| **Prix** | Moyen | Moyen-Haut | Compétitif |
| **Free Tier** | 12 mois | 12 mois | 90 jours |
| **Kubernetes** | EKS | AKS | GKE |
| **Conteneurs** | ECS/Fargate | Container Apps | Cloud Run |
| **Base de données** | RDS | Azure DB | Cloud SQL |
| **Documentation** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Interface** | Complexe | Moyenne | Simple |

---

## 🚀 AWS - Amazon Web Services

### Option 1: ECS Fargate (Serverless Containers)

#### Architecture
\`\`\`
┌─────────────┐
│     ALB     │  (Application Load Balancer)
└──────┬──────┘
       │
   ┌───┴────┐
   │        │
┌──▼──┐  ┌──▼──┐
│ ECS │  │ ECS │  (Fargate Tasks)
│Task │  │Task │
└──┬──┘  └──┬──┘
   │        │
   └────┬───┘
        ▼
   ┌────────┐
   │   RDS  │  (PostgreSQL)
   └────────┘
\`\`\`

#### 1. Créer un VPC

\`\`\`bash
# Utiliser AWS CLI
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=devflow-vpc}]'

# Créer des subnets publics et privés
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.2.0/24 --availability-zone us-east-1b
\`\`\`

#### 2. Créer RDS PostgreSQL

\`\`\`bash
aws rds create-db-instance \\
  --db-instance-identifier devflow-postgres \\
  --db-instance-class db.t3.micro \\
  --engine postgres \\
  --engine-version 15.4 \\
  --master-username devflow \\
  --master-user-password 'YourSecurePassword' \\
  --allocated-storage 20 \\
  --vpc-security-group-ids sg-xxx \\
  --db-subnet-group-name devflow-subnet-group \\
  --backup-retention-period 7 \\
  --storage-encrypted
\`\`\`

#### 3. Task Definitions ECS

\`\`\`json
{
  "family": "devflow-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::xxx:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "ghcr.io/username/devflow-backend:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "SPRING_PROFILES_ACTIVE",
          "value": "prod"
        }
      ],
      "secrets": [
        {
          "name": "SPRING_DATASOURCE_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:xxx:secret:devflow-db-password"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/devflow-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8080/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
\`\`\`

#### 4. Créer le Service ECS

\`\`\`bash
aws ecs create-service \\
  --cluster devflow-cluster \\
  --service-name devflow-backend \\
  --task-definition devflow-backend:1 \\
  --desired-count 2 \\
  --launch-type FARGATE \\
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \\
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:xxx,containerName=backend,containerPort=8080"
\`\`\`

#### 5. Configuration ALB

\`\`\`bash
# Créer Application Load Balancer
aws elbv2 create-load-balancer \\
  --name devflow-alb \\
  --subnets subnet-xxx subnet-yyy \\
  --security-groups sg-xxx \\
  --scheme internet-facing

# Créer Target Group
aws elbv2 create-target-group \\
  --name devflow-backend-tg \\
  --protocol HTTP \\
  --port 8080 \\
  --vpc-id vpc-xxx \\
  --target-type ip \\
  --health-check-path /health
\`\`\`

#### Coût Estimé AWS
\`\`\`
ECS Fargate (2 tasks 0.5 vCPU, 1GB): ~$30/mois
RDS db.t3.micro (20GB): ~$15/mois
ALB: ~$20/mois
Data Transfer: ~$10/mois
TOTAL: ~$75/mois
\`\`\`

---

### Option 2: EKS (Kubernetes managé)

#### 1. Créer le Cluster EKS

\`\`\`bash
# Installer eksctl
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_\$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Créer le cluster
eksctl create cluster \\
  --name devflow-cluster \\
  --region us-east-1 \\
  --nodegroup-name devflow-nodes \\
  --node-type t3.medium \\
  --nodes 2 \\
  --nodes-min 1 \\
  --nodes-max 4 \\
  --managed
\`\`\`

#### 2. Déploiement Kubernetes

\`\`\`yaml
# devflow-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: devflow-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: devflow-backend
  template:
    metadata:
      labels:
        app: devflow-backend
    spec:
      containers:
      - name: backend
        image: ghcr.io/username/devflow-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        - name: SPRING_DATASOURCE_URL
          valueFrom:
            secretKeyRef:
              name: devflow-secrets
              key: db-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: devflow-backend-service
spec:
  selector:
    app: devflow-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
\`\`\`

\`\`\`bash
# Appliquer la configuration
kubectl apply -f devflow-deployment.yaml

# Vérifier le déploiement
kubectl get pods
kubectl get services
\`\`\`

---

## 🔷 Azure - Microsoft Azure

### Option 1: Azure Container Apps

\`\`\`bash
# Installer Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login
az login

# Créer un groupe de ressources
az group create --name devflow-rg --location eastus

# Créer Container Apps environment
az containerapp env create \\
  --name devflow-env \\
  --resource-group devflow-rg \\
  --location eastus

# Créer Azure Database for PostgreSQL
az postgres flexible-server create \\
  --resource-group devflow-rg \\
  --name devflow-postgres \\
  --location eastus \\
  --admin-user devflow \\
  --admin-password 'YourSecurePassword123!' \\
  --sku-name Standard_B1ms \\
  --tier Burstable \\
  --storage-size 32

# Déployer le backend
az containerapp create \\
  --name devflow-backend \\
  --resource-group devflow-rg \\
  --environment devflow-env \\
  --image ghcr.io/username/devflow-backend:latest \\
  --target-port 8080 \\
  --ingress external \\
  --min-replicas 1 \\
  --max-replicas 3 \\
  --cpu 0.5 \\
  --memory 1.0Gi \\
  --env-vars \\
    SPRING_PROFILES_ACTIVE=prod \\
    SPRING_DATASOURCE_URL=secretref:db-url
\`\`\`

#### Coût Estimé Azure
\`\`\`
Container Apps (2 instances): ~$40/mois
Azure PostgreSQL Flexible: ~$12/mois
Ingress/Egress: ~$5/mois
TOTAL: ~$57/mois
\`\`\`

---

## 🌐 GCP - Google Cloud Platform

### Option 1: Cloud Run (Serverless)

\`\`\`bash
# Installer gcloud CLI
curl https://sdk.cloud.google.com | bash
exec -l \$SHELL
gcloud init

# Activer les APIs
gcloud services enable run.googleapis.com
gcloud services enable sql-component.googleapis.com

# Créer Cloud SQL (PostgreSQL)
gcloud sql instances create devflow-postgres \\
  --database-version=POSTGRES_15 \\
  --tier=db-f1-micro \\
  --region=us-central1

gcloud sql databases create devflow --instance=devflow-postgres

# Déployer sur Cloud Run
gcloud run deploy devflow-backend \\
  --image ghcr.io/username/devflow-backend:latest \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated \\
  --port 8080 \\
  --memory 1Gi \\
  --cpu 1 \\
  --min-instances 0 \\
  --max-instances 10 \\
  --set-env-vars SPRING_PROFILES_ACTIVE=prod \\
  --add-cloudsql-instances devflow-postgres

# Déployer le frontend
gcloud run deploy devflow-frontend \\
  --image ghcr.io/username/devflow-frontend:latest \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated \\
  --port 80
\`\`\`

#### Terraform pour GCP

\`\`\`hcl
# main.tf
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = "devflow-project"
  region  = "us-central1"
}

resource "google_cloud_run_service" "backend" {
  name     = "devflow-backend"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "ghcr.io/username/devflow-backend:latest"

        ports {
          container_port = 8080
        }

        resources {
          limits = {
            memory = "1Gi"
            cpu    = "1"
          }
        }

        env {
          name  = "SPRING_PROFILES_ACTIVE"
          value = "prod"
        }
      }

      container_concurrency = 80
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = "1"
        "autoscaling.knative.dev/maxScale" = "10"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service_iam_member" "public_access" {
  service  = google_cloud_run_service.backend.name
  location = google_cloud_run_service.backend.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_sql_database_instance" "postgres" {
  name             = "devflow-postgres"
  database_version = "POSTGRES_15"
  region           = "us-central1"

  settings {
    tier = "db-f1-micro"

    backup_configuration {
      enabled = true
      start_time = "02:00"
    }

    ip_configuration {
      ipv4_enabled = true
      authorized_networks {
        name  = "all"
        value = "0.0.0.0/0"
      }
    }
  }
}

output "backend_url" {
  value = google_cloud_run_service.backend.status[0].url
}
\`\`\`

#### Coût Estimé GCP
\`\`\`
Cloud Run (avec trafic moyen): ~$15/mois
Cloud SQL db-f1-micro: ~$10/mois
Network Egress: ~$5/mois
TOTAL: ~$30/mois (le moins cher!)
\`\`\`

---

## 🎯 Quelle Plateforme Choisir ?

### Choisissez AWS si :
- ✅ Vous avez besoin du plus large éventail de services
- ✅ Votre entreprise utilise déjà AWS
- ✅ Vous avez besoin de features avancées (Lambda@Edge, etc.)

### Choisissez Azure si :
- ✅ Vous utilisez déjà l'écosystème Microsoft
- ✅ Vous avez besoin d'intégration Active Directory
- ✅ Vous développez des applications .NET

### Choisissez GCP si :
- ✅ Vous voulez le meilleur rapport qualité/prix
- ✅ Vous privilégiez la simplicité
- ✅ Vous utilisez beaucoup Kubernetes (GKE est excellent)
- ✅ Vous voulez des services serverless performants

---

## 📋 Checklist Déploiement Cloud

### Avant le Déploiement
- [ ] Compte cloud créé et configuré
- [ ] Billing alerts configurées
- [ ] IAM roles et permissions configurés
- [ ] Images Docker buildées et pushées
- [ ] Variables d'environnement préparées
- [ ] Base de données créée
- [ ] Networking (VPC, subnets) configuré

### Sécurité
- [ ] HTTPS/TLS activé
- [ ] Secrets manager utilisé
- [ ] Network ACLs configurées
- [ ] Backup automatique activé
- [ ] Logs centralisés configurés
- [ ] Monitoring et alertes activés

### Après le Déploiement
- [ ] Health checks validés
- [ ] Performance testée
- [ ] Auto-scaling configuré
- [ ] CI/CD pipeline connecté
- [ ] Documentation mise à jour

---

**DevFlow peut maintenant tourner sur n'importe quel cloud majeur ! ☁️🚀**
`
      },

      {
        id: 'deployment-strategies',
        title: 'Stratégies de Déploiement Avancées',
        category: GuideCategory.DEPLOYMENT,
        icon: 'shuffle',
        color: '#f59e0b',
        order: 3,
        tags: ['Blue-Green', 'Canary', 'Rolling', 'Rollback'],
        lastUpdated: new Date(),
        content: `# Stratégies de Déploiement Avancées 🎯

## 📌 Introduction

Les **stratégies de déploiement** déterminent comment les nouvelles versions de votre application sont mises en production. Ce guide couvre les techniques professionnelles pour minimiser les risques et le downtime.

---

## 🎨 Types de Déploiement

### Comparaison

| Stratégie | Downtime | Risque | Complexité | Rollback | Coût |
|-----------|----------|--------|------------|----------|------|
| **Recreate** | Oui | Élevé | Faible | Lent | Faible |
| **Rolling** | Non | Moyen | Moyenne | Moyen | Faible |
| **Blue-Green** | Non | Faible | Moyenne | Rapide | Moyen |
| **Canary** | Non | Très Faible | Élevée | Rapide | Moyen |
| **A/B Testing** | Non | Faible | Très Élevée | Rapide | Élevé |

---

## 1️⃣ Recreate Deployment

### Concept
Arrêter complètement l'ancienne version puis démarrer la nouvelle.

\`\`\`
Version 1 ████████████████ ⬇️ STOP
                              ⏸️ DOWNTIME
Version 2                     ⬆️ START ████████████████
\`\`\`

### Implémentation Docker Compose

\`\`\`bash
# Arrêter l'application
docker-compose down

# Mettre à jour les images
docker-compose pull

# Redémarrer
docker-compose up -d
\`\`\`

### Avantages
- ✅ Simple à implémenter
- ✅ Pas de versioning complexe
- ✅ Consommation de ressources minimale

### Inconvénients
- ❌ Downtime complet
- ❌ Pas de rollback rapide
- ❌ Risque élevé

### Quand l'utiliser ?
- Applications non critiques
- Maintenance planifiée
- Environnements de développement

---

## 2️⃣ Rolling Deployment

### Concept
Remplacer progressivement les instances de l'ancienne version par la nouvelle.

\`\`\`
Étape 1: [V1] [V1] [V1] [V1]
Étape 2: [V2] [V1] [V1] [V1]
Étape 3: [V2] [V2] [V1] [V1]
Étape 4: [V2] [V2] [V2] [V1]
Étape 5: [V2] [V2] [V2] [V2]
\`\`\`

### Implémentation Kubernetes

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: devflow-backend
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # 1 pod supplémentaire max pendant l'update
      maxUnavailable: 1  # 1 pod indisponible max pendant l'update
  selector:
    matchLabels:
      app: devflow-backend
  template:
    metadata:
      labels:
        app: devflow-backend
        version: v2.0.0
    spec:
      containers:
      - name: backend
        image: devflow/backend:v2.0.0
        ports:
        - containerPort: 8080
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 10
\`\`\`

### Déploiement

\`\`\`bash
# Appliquer la mise à jour
kubectl apply -f deployment.yaml

# Suivre le rollout
kubectl rollout status deployment/devflow-backend

# Pause du rollout (si problème détecté)
kubectl rollout pause deployment/devflow-backend

# Reprendre le rollout
kubectl rollout resume deployment/devflow-backend

# Rollback si nécessaire
kubectl rollout undo deployment/devflow-backend
\`\`\`

### Implémentation Docker Swarm

\`\`\`bash
docker service update \\
  --image devflow/backend:v2.0.0 \\
  --update-parallelism 1 \\
  --update-delay 10s \\
  --update-failure-action rollback \\
  devflow-backend
\`\`\`

### Avantages
- ✅ Pas de downtime
- ✅ Rollback possible
- ✅ Consommation modérée de ressources

### Inconvénients
- ❌ Deux versions coexistent temporairement
- ❌ Peut causer des problèmes de compatibilité
- ❌ Rollback pas instantané

---

## 3️⃣ Blue-Green Deployment

### Concept
Maintenir deux environnements identiques (Blue = production, Green = nouvelle version). Basculer le trafic instantanément.

\`\`\`
┌─────────────┐
│   Router    │
└──────┬──────┘
       │
       ├─────> [Blue Env]  (v1.0) ◄── Production actuelle
       │
       └─────> [Green Env] (v2.0) ◄── Nouvelle version (en attente)

Après validation:
┌─────────────┐
│   Router    │
└──────┬──────┘
       │
       ├─────> [Blue Env]  (v1.0) ◄── Idle (rollback possible)
       │
       └─────> [Green Env] (v2.0) ◄── Production
\`\`\`

### Implémentation avec Nginx

\`\`\`nginx
# /etc/nginx/conf.d/devflow.conf

upstream blue_backend {
    server 10.0.1.10:8080;
    server 10.0.1.11:8080;
}

upstream green_backend {
    server 10.0.2.10:8080;
    server 10.0.2.11:8080;
}

# Fichier de switch
map $http_upgrade $backend {
    default blue_backend;
    # Changer cette ligne pour basculer:
    # default green_backend;
}

server {
    listen 80;
    server_name devflow.com;

    location / {
        proxy_pass http://$backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
\`\`\`

### Script de Basculement

\`\`\`bash
#!/bin/bash
# switch-environment.sh

CURRENT=$(grep "default" /etc/nginx/conf.d/devflow.conf | awk '{print $2}' | tr -d ';')

if [ "$CURRENT" == "blue_backend" ]; then
    NEW="green_backend"
    OLD="blue_backend"
else
    NEW="blue_backend"
    OLD="green_backend"
fi

echo "🔄 Switching from $OLD to $NEW..."

# Modifier la configuration Nginx
sed -i "s/default $OLD;/default $NEW;/" /etc/nginx/conf.d/devflow.conf

# Tester la config
nginx -t

if [ $? -eq 0 ]; then
    # Recharger Nginx
    systemctl reload nginx
    echo "✅ Successfully switched to $NEW"
else
    # Rollback en cas d'erreur
    sed -i "s/default $NEW;/default $OLD;/" /etc/nginx/conf.d/devflow.conf
    echo "❌ Switch failed, rolled back to $OLD"
    exit 1
fi
\`\`\`

### Implémentation AWS avec Load Balancer

\`\`\`bash
# Créer deux Target Groups (Blue et Green)
aws elbv2 create-target-group --name devflow-blue-tg ...
aws elbv2 create-target-group --name devflow-green-tg ...

# Basculer le trafic du listener
aws elbv2 modify-listener \\
  --listener-arn arn:aws:elasticloadbalancing:xxx \\
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:xxx:targetgroup/devflow-green-tg
\`\`\`

### Avantages
- ✅ Basculement instantané
- ✅ Rollback immédiat
- ✅ Tests en production possibles (sur Green avant switch)
- ✅ Pas de risque de version mixte

### Inconvénients
- ❌ Double infrastructure = 2x les ressources
- ❌ Coût élevé
- ❌ Gestion de deux bases de données peut être complexe

---

## 4️⃣ Canary Deployment

### Concept
Déployer la nouvelle version pour un **petit pourcentage d'utilisateurs** (5-10%), puis augmenter progressivement.

\`\`\`
Étape 1: 95% → V1    5% → V2   (Canary)
Étape 2: 75% → V1   25% → V2
Étape 3: 50% → V1   50% → V2
Étape 4: 25% → V1   75% → V2
Étape 5:  0% → V1  100% → V2
\`\`\`

### Implémentation Kubernetes avec Istio

\`\`\`yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: devflow-backend
spec:
  hosts:
  - devflow-backend
  http:
  - match:
    - headers:
        x-version:
          exact: "canary"
    route:
    - destination:
        host: devflow-backend
        subset: v2
  - route:
    - destination:
        host: devflow-backend
        subset: v1
      weight: 90
    - destination:
        host: devflow-backend
        subset: v2
      weight: 10
---
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: devflow-backend
spec:
  host: devflow-backend
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
\`\`\`

### Implémentation avec Nginx (Weight-based)

\`\`\`nginx
upstream backend {
    server v1.devflow.com:8080 weight=9;  # 90%
    server v2.devflow.com:8080 weight=1;  # 10%
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
\`\`\`

### Script d'Augmentation Progressive

\`\`\`bash
#!/bin/bash
# canary-rollout.sh

WEIGHTS=(5 10 25 50 75 100)

for WEIGHT in "\${WEIGHTS[@]}"; do
    echo "🚀 Deploying canary with $WEIGHT% traffic..."

    # Mettre à jour la configuration
    V1_WEIGHT=$((100 - WEIGHT))
    sed -i "s/weight=[0-9]*/weight=$V1_WEIGHT/" /etc/nginx/upstream-v1.conf
    sed -i "s/weight=[0-9]*/weight=$WEIGHT/" /etc/nginx/upstream-v2.conf

    nginx -s reload

    # Attendre et surveiller les métriques
    echo "⏳ Monitoring for 10 minutes..."
    sleep 600

    # Vérifier les métriques (exemple avec curl vers Prometheus)
    ERROR_RATE=$(curl -s "http://prometheus:9090/api/v1/query?query=error_rate" | jq -r '.data.result[0].value[1]')

    if (( $(echo "$ERROR_RATE > 0.05" | bc -l) )); then
        echo "❌ Error rate too high ($ERROR_RATE), rolling back!"
        # Rollback
        sed -i "s/weight=[0-9]*/weight=100/" /etc/nginx/upstream-v1.conf
        sed -i "s/weight=[0-9]*/weight=0/" /etc/nginx/upstream-v2.conf
        nginx -s reload
        exit 1
    fi

    echo "✅ Canary at $WEIGHT% successful"
done

echo "🎉 Canary deployment completed successfully!"
\`\`\`

### Avantages
- ✅ Risque minimal
- ✅ Détection rapide des problèmes
- ✅ Impact limité en cas de bug
- ✅ Feedback réel des utilisateurs

### Inconvénients
- ❌ Complexe à implémenter
- ❌ Nécessite un monitoring avancé
- ❌ Déploiement plus long

---

## 5️⃣ A/B Testing Deployment

### Concept
Déployer deux versions différentes pour tester des **features** spécifiques auprès de groupes d'utilisateurs.

\`\`\`
Utilisateurs Groupe A → Version A (nouvelle UI)
Utilisateurs Groupe B → Version B (ancienne UI)
\`\`\`

### Implémentation avec Feature Flags

\`\`\`typescript
// feature-flag.service.ts
@Injectable()
export class FeatureFlagService {
  constructor(private http: HttpClient) {}

  isFeatureEnabled(userId: string, featureName: string): Observable<boolean> {
    return this.http.get<{enabled: boolean}>(
      \`/api/features/\${featureName}/user/\${userId}\`
    ).pipe(
      map(response => response.enabled),
      catchError(() => of(false))
    );
  }
}

// app.component.ts
export class AppComponent implements OnInit {
  showNewUI = false;

  constructor(private featureFlags: FeatureFlagService) {}

  ngOnInit() {
    const userId = this.authService.getUserId();
    this.featureFlags.isFeatureEnabled(userId, 'new-dashboard')
      .subscribe(enabled => this.showNewUI = enabled);
  }
}
\`\`\`

### Backend avec LaunchDarkly

\`\`\`java
@Service
public class FeatureFlagService {
    private final LDClient ldClient;

    public boolean isNewDashboardEnabled(String userId) {
        LDUser user = new LDUser.Builder(userId)
            .custom("plan", "premium")
            .build();

        return ldClient.boolVariation("new-dashboard", user, false);
    }
}
\`\`\`

---

## 📊 Monitoring pendant le Déploiement

### Métriques Clés à Surveiller

\`\`\`yaml
# Prometheus alerts
groups:
  - name: deployment
    rules:
    - alert: HighErrorRate
      expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
      for: 5m
      annotations:
        summary: "Error rate above 5%"

    - alert: HighResponseTime
      expr: histogram_quantile(0.95, http_request_duration_seconds) > 1
      for: 5m
      annotations:
        summary: "P95 latency above 1s"

    - alert: DeploymentFailed
      expr: kube_deployment_status_replicas_available < kube_deployment_spec_replicas
      for: 10m
      annotations:
        summary: "Deployment has unavailable replicas"
\`\`\`

### Health Check Avancé

\`\`\`java
@RestController
@RequestMapping("/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<HealthStatus> health() {
        HealthStatus status = HealthStatus.builder()
            .status("UP")
            .version(getVersion())
            .timestamp(Instant.now())
            .checks(performHealthChecks())
            .build();

        return ResponseEntity.ok(status);
    }

    @GetMapping("/ready")
    public ResponseEntity<Void> readiness() {
        // Vérifier que l'app est prête à recevoir du trafic
        if (isDatabaseConnected() && isCacheWarmed()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(503).build();
    }

    @GetMapping("/live")
    public ResponseEntity<Void> liveness() {
        // Vérifier que l'app est vivante (pas deadlock)
        return ResponseEntity.ok().build();
    }
}
\`\`\`

---

## 🔄 Stratégie de Rollback

### Plan de Rollback Automatique

\`\`\`bash
#!/bin/bash
# auto-rollback.sh

DEPLOYMENT="devflow-backend"
THRESHOLD_ERROR_RATE=0.05
THRESHOLD_LATENCY_P95=1000  # ms

echo "🔍 Monitoring deployment..."

for i in {1..10}; do
    sleep 60

    # Récupérer les métriques
    ERROR_RATE=$(curl -s "http://prometheus:9090/api/v1/query?query=rate(http_errors[5m])" | jq -r '.data.result[0].value[1]')
    LATENCY=$(curl -s "http://prometheus:9090/api/v1/query?query=histogram_quantile(0.95,http_latency)" | jq -r '.data.result[0].value[1]')

    # Vérifier les seuils
    if (( $(echo "$ERROR_RATE > $THRESHOLD_ERROR_RATE" | bc -l) )); then
        echo "❌ Error rate ($ERROR_RATE) exceeds threshold!"
        kubectl rollout undo deployment/$DEPLOYMENT
        exit 1
    fi

    if (( $(echo "$LATENCY > $THRESHOLD_LATENCY_P95" | bc -l) )); then
        echo "❌ Latency ($LATENCY ms) exceeds threshold!"
        kubectl rollout undo deployment/$DEPLOYMENT
        exit 1
    fi

    echo "✅ Iteration $i: Metrics OK (Error: $ERROR_RATE, Latency: \${LATENCY}ms)"
done

echo "🎉 Deployment validated successfully!"
\`\`\`

---

## 📋 Checklist de Déploiement

### Avant le Déploiement
- [ ] Tests passés (unit, integration, E2E)
- [ ] Code review approuvé
- [ ] Documentation mise à jour
- [ ] Plan de rollback préparé
- [ ] Fenêtre de déploiement planifiée
- [ ] Équipe informée

### Pendant le Déploiement
- [ ] Monitoring actif
- [ ] Logs en temps réel consultés
- [ ] Métriques business surveillées
- [ ] Communication active (Slack, etc.)

### Après le Déploiement
- [ ] Health checks validés
- [ ] Smoke tests exécutés
- [ ] Métriques stables pendant 1h
- [ ] Feedback utilisateurs collecté
- [ ] Ancienne version conservée (rollback possible)

---

## 🎯 Recommandations par Cas d'Usage

### Application Critique (Banking, Healthcare)
→ **Canary** ou **Blue-Green** avec validation manuelle

### E-commerce
→ **Blue-Green** pour les heures creuses, **Canary** pour les heures de pointe

### SaaS B2B
→ **Rolling** avec A/B testing pour les nouvelles features

### Startup/MVP
→ **Rolling** ou **Recreate** (simple et efficace)

### Application Interne
→ **Recreate** avec fenêtre de maintenance

---

**Choisissez la stratégie qui correspond à vos contraintes de risque, coût et complexité ! 🚀**
`
      },

      // =========================
      // MONITORING GUIDES
      // =========================

      {
        id: 'monitoring-prometheus-grafana',
        title: 'Monitoring avec Prometheus & Grafana',
        category: GuideCategory.MONITORING,
        icon: 'monitoring',
        color: '#ec4899',
        order: 1,
        tags: ['Prometheus', 'Grafana', 'Metrics', 'Alerting'],
        lastUpdated: new Date(),
        content: `# Monitoring avec Prometheus & Grafana 📊

## 📌 Introduction

**Prometheus** est un système de monitoring et d'alerte open-source qui collecte des métriques time-series. **Grafana** est un outil de visualisation qui crée des dashboards magnifiques à partir de ces données.

---

## 🏗️ Architecture

\`\`\`
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   DevFlow    │ ───> │  Prometheus  │ ───> │   Grafana    │
│  (metrics)   │      │  (storage)   │      │ (dashboard)  │
└──────────────┘      └──────┬───────┘      └──────────────┘
                             │
                             ▼
                      ┌──────────────┐
                      │ Alertmanager │
                      │ (alerts)     │
                      └──────────────┘
\`\`\`

---

## 🐳 Installation avec Docker Compose

### docker-compose.monitoring.yml

\`\`\`yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./prometheus/alerts.yml:/etc/prometheus/alerts.yml
      - prometheus-data:/prometheus
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=\${GRAFANA_PASSWORD:-admin}
      - GF_INSTALL_PLUGINS=grafana-piechart-panel
      - GF_SERVER_ROOT_URL=https://monitoring.devflow.com
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning
    networks:
      - monitoring

  alertmanager:
    image: prom/alertmanager:latest
    container_name: alertmanager
    restart: unless-stopped
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - alertmanager-data:/alertmanager
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--storage.path=/alertmanager'
    networks:
      - monitoring

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: unless-stopped
    ports:
      - "9100:9100"
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    networks:
      - monitoring

volumes:
  prometheus-data:
  grafana-data:
  alertmanager-data:

networks:
  monitoring:
    driver: bridge
\`\`\`

---

## ⚙️ Configuration Prometheus

### prometheus/prometheus.yml

\`\`\`yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'devflow-prod'
    environment: 'production'

# Chargement des règles d'alerte
rule_files:
  - 'alerts.yml'

# Configuration Alertmanager
alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

# Cibles à scraper
scrape_configs:
  # Prometheus lui-même
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Métriques système (Node Exporter)
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  # Backend Spring Boot
  - job_name: 'devflow-backend'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['backend:8080']
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
        replacement: 'devflow-backend'

  # PostgreSQL (avec postgres-exporter)
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  # Nginx (avec nginx-prometheus-exporter)
  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx-exporter:9113']
\`\`\`

---

## 🚨 Configuration des Alertes

### prometheus/alerts.yml

\`\`\`yaml
groups:
  - name: devflow_alerts
    interval: 30s
    rules:
      # Application Down
      - alert: ApplicationDown
        expr: up{job="devflow-backend"} == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "DevFlow backend is down"
          description: "Backend instance {{ $labels.instance }} is unreachable for 2 minutes"

      # Taux d'erreur élevé
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }} (threshold: 5%)"

      # Latence élevée
      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency detected"
          description: "P95 latency is {{ $value }}s (threshold: 1s)"

      # Utilisation CPU élevée
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage"
          description: "CPU usage is {{ $value | humanize }}% on {{ $labels.instance }}"

      # Utilisation mémoire élevée
      - alert: HighMemoryUsage
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 85
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value | humanize }}% on {{ $labels.instance }}"

      # Espace disque faible
      - alert: LowDiskSpace
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100 < 10
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Low disk space"
          description: "Only {{ $value | humanize }}% disk space left on {{ $labels.instance }}"

      # Base de données - Trop de connexions
      - alert: HighDatabaseConnections
        expr: pg_stat_activity_count > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High database connection count"
          description: "{{ $value }} active connections (threshold: 80)"

      # Base de données - Réplication en retard
      - alert: PostgresReplicationLag
        expr: pg_replication_lag > 10
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "PostgreSQL replication lag"
          description: "Replication lag is {{ $value }} seconds"
\`\`\`

---

## 📧 Configuration Alertmanager

### alertmanager/alertmanager.yml

\`\`\`yaml
global:
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_from: 'alerts@devflow.com'
  smtp_auth_username: 'alerts@devflow.com'
  smtp_auth_password: 'your-app-password'

# Templates pour les notifications
templates:
  - '/etc/alertmanager/templates/*.tmpl'

# Routage des alertes
route:
  receiver: 'default'
  group_by: ['alertname', 'cluster', 'severity']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h

  routes:
    # Alertes critiques -> PagerDuty + Slack + Email
    - match:
        severity: critical
      receiver: 'critical'
      continue: true

    # Alertes warning -> Slack
    - match:
        severity: warning
      receiver: 'slack'

# Receivers (destinations des alertes)
receivers:
  - name: 'default'
    email_configs:
      - to: 'team@devflow.com'

  - name: 'critical'
    pagerduty_configs:
      - service_key: 'YOUR_PAGERDUTY_KEY'
    slack_configs:
      - api_url: 'YOUR_SLACK_WEBHOOK'
        channel: '#alerts-critical'
        title: '🚨 Critical Alert'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
    email_configs:
      - to: 'oncall@devflow.com'
        headers:
          Subject: '[CRITICAL] {{ .GroupLabels.alertname }}'

  - name: 'slack'
    slack_configs:
      - api_url: 'YOUR_SLACK_WEBHOOK'
        channel: '#alerts'
        title: '⚠️ Warning Alert'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'

# Inhibition rules (éviter les alertes redondantes)
inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'instance']
\`\`\`

---

## 🎨 Configuration Grafana

### Provisioning des Datasources

Créez \`grafana/provisioning/datasources/prometheus.yml\` :

\`\`\`yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: false
\`\`\`

### Dashboard DevFlow - Application Metrics

\`\`\`json
{
  "dashboard": {
    "title": "DevFlow - Application Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Response Time (P95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))"
          }
        ],
        "type": "graph"
      },
      {
        "title": "Active Users",
        "targets": [
          {
            "expr": "active_users_total"
          }
        ],
        "type": "stat"
      }
    ]
  }
}
\`\`\`

---

## 📈 Métriques Spring Boot

### 1. Ajouter les Dépendances

\`\`\`xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
\`\`\`

### 2. Configuration Spring Boot

\`\`\`yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus,metrics
      base-path: /actuator
  metrics:
    tags:
      application: devflow
      environment: production
    export:
      prometheus:
        enabled: true
  endpoint:
    health:
      show-details: always
    prometheus:
      enabled: true
\`\`\`

### 3. Métriques Custom

\`\`\`java
@Service
public class GuideService {
    private final MeterRegistry meterRegistry;
    private final Counter guideViewCounter;
    private final Timer guideLoadTimer;

    public GuideService(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;

        // Counter pour les vues de guide
        this.guideViewCounter = Counter.builder("guides.views")
            .description("Number of guide views")
            .tag("type", "view")
            .register(meterRegistry);

        // Timer pour mesurer le temps de chargement
        this.guideLoadTimer = Timer.builder("guides.load.time")
            .description("Time to load a guide")
            .register(meterRegistry);
    }

    public Guide getGuide(String id) {
        return guideLoadTimer.record(() -> {
            guideViewCounter.increment();
            return guideRepository.findById(id)
                .orElseThrow(() -> new GuideNotFoundException(id));
        });
    }
}
\`\`\`

---

## 🔍 Queries Prometheus Utiles

\`\`\`promql
# Request rate par endpoint
rate(http_requests_total[5m])

# Taux d'erreur
rate(http_requests_total{status=~"5.."}[5m])
  / rate(http_requests_total[5m])

# Latence P50, P95, P99
histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))

# Utilisation CPU
100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Utilisation mémoire
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Connexions base de données actives
pg_stat_activity_count{state="active"}

# Throughput
sum(rate(http_requests_total[1m]))
\`\`\`

---

## 📊 Dashboards Grafana Recommandés

### 1. Importer des Dashboards Communautaires

\`\`\`
Node Exporter Full: 1860
Spring Boot: 12900
PostgreSQL: 9628
Nginx: 12708
\`\`\`

### 2. Dashboard DevFlow Custom

Créez \`grafana/provisioning/dashboards/devflow.json\` avec :

- **Row 1: Application Health**
  - Uptime
  - Request Rate
  - Error Rate
  - Active Users

- **Row 2: Performance**
  - Response Time (P50, P95, P99)
  - Throughput
  - Database Query Time

- **Row 3: Infrastructure**
  - CPU Usage
  - Memory Usage
  - Disk I/O
  - Network Traffic

- **Row 4: Business Metrics**
  - Guides Viewed (Top 10)
  - User Registrations
  - Search Queries

---

## 🚀 Démarrage

\`\`\`bash
# Démarrer la stack de monitoring
docker-compose -f docker-compose.monitoring.yml up -d

# Vérifier les services
docker-compose -f docker-compose.monitoring.yml ps

# Accéder aux interfaces
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3000 (admin/admin)
# Alertmanager: http://localhost:9093
\`\`\`

---

## 📋 Checklist Monitoring

### Configuration
- [ ] Prometheus installé et configuré
- [ ] Grafana installé avec datasource Prometheus
- [ ] Alertmanager configuré
- [ ] Node Exporter déployé
- [ ] Métriques applicatives exposées

### Alertes
- [ ] Alertes critiques configurées
- [ ] Notifications Slack/Email configurées
- [ ] Escalation PagerDuty (production)
- [ ] Alertes testées

### Dashboards
- [ ] Dashboard système (CPU, RAM, Disk)
- [ ] Dashboard application (requests, errors, latency)
- [ ] Dashboard business metrics
- [ ] Dashboards partagés avec l'équipe

### Maintenance
- [ ] Rétention des données configurée (30 jours)
- [ ] Backups Grafana configurés
- [ ] Documentation des alertes
- [ ] Runbooks pour les alertes critiques

---

**Avec Prometheus et Grafana, vous avez une visibilité totale sur DevFlow ! 📊🔍**
`
      },

      {
        id: 'monitoring-logging',
        title: 'Logging & Gestion des Logs',
        category: GuideCategory.MONITORING,
        icon: 'description',
        color: '#ec4899',
        order: 2,
        tags: ['Logs', 'ELK', 'Loki', 'Logging'],
        lastUpdated: new Date(),
        content: `# Logging & Gestion des Logs 📝

## 📌 Introduction

Les **logs** sont essentiels pour déboguer, auditer et comprendre le comportement de votre application. Ce guide couvre les meilleures pratiques de logging et deux stacks populaires : **ELK** (Elasticsearch, Logstash, Kibana) et **Loki/Promtail/Grafana**.

---

## 📊 Comparaison des Solutions

| Critère | ELK Stack | Loki + Grafana | CloudWatch / Stackdriver |
|---------|-----------|----------------|--------------------------|
| **Coût** | Moyen (infra) | Faible | Pay-as-you-go |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Complexité** | Élevée | Moyenne | Faible |
| **Stockage** | Important | Optimisé | Géré |
| **Recherche** | Très puissante | Basique | Moyenne |
| **Indexation** | Tout | Labels only | Automatique |
| **Rétention** | Configurable | Configurable | Configurable |

---

## 🎯 Niveaux de Log

### Standard
\`\`\`
TRACE → DEBUG → INFO → WARN → ERROR → FATAL
\`\`\`

### Spring Boot / Logback

\`\`\`java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class GuideService {
    private static final Logger log = LoggerFactory.getLogger(GuideService.class);

    public Guide getGuide(String id) {
        log.trace("Entering getGuide with id: {}", id);  // Très détaillé
        log.debug("Searching guide in database: {}", id);  // Debug

        try {
            Guide guide = guideRepository.findById(id)
                .orElseThrow(() -> new GuideNotFoundException(id));

            log.info("Guide {} successfully retrieved", id);  // Info normale
            return guide;

        } catch (GuideNotFoundException e) {
            log.warn("Guide not found: {}", id);  // Attention
            throw e;
        } catch (Exception e) {
            log.error("Error retrieving guide {}: {}", id, e.getMessage(), e);  // Erreur
            throw e;
        }
    }
}
\`\`\`

### Angular / TypeScript

\`\`\`typescript
// logger.service.ts
@Injectable()
export class LoggerService {
  private isDevelopment = !environment.production;

  debug(message: string, ...args: any[]) {
    if (this.isDevelopment) {
      console.debug(\`[DEBUG] \${message}\`, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    console.info(\`[INFO] \${message}\`, ...args);
  }

  warn(message: string, ...args: any[]) {
    console.warn(\`[WARN] \${message}\`, ...args);
  }

  error(message: string, error?: any) {
    console.error(\`[ERROR] \${message}\`, error);
    // Envoyer à un service d'erreurs (Sentry, etc.)
    this.sendToErrorTracking(message, error);
  }
}
\`\`\`

---

## 🔧 Configuration Logback (Spring Boot)

### logback-spring.xml

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- Console Appender -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="net.logstash.logback.encoder.LogstashEncoder">
            <includeContext>true</includeContext>
            <includeMdc>true</includeMdc>
            <includeCallerData>false</includeCallerData>
            <customFields>{"app":"devflow","env":"production"}</customFields>
        </encoder>
    </appender>

    <!-- File Appender -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>/var/log/devflow/application.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>/var/log/devflow/application-%d{yyyy-MM-dd}.log.gz</fileNamePattern>
            <maxHistory>30</maxHistory>
            <totalSizeCap>5GB</totalSizeCap>
        </rollingPolicy>
        <encoder class="net.logstash.logback.encoder.LogstashEncoder"/>
    </appender>

    <!-- Async Appender (meilleure performance) -->
    <appender name="ASYNC_FILE" class="ch.qos.logback.classic.AsyncAppender">
        <queueSize>512</queueSize>
        <discardingThreshold>0</discardingThreshold>
        <appender-ref ref="FILE"/>
    </appender>

    <!-- Loggers par package -->
    <logger name="com.devflow" level="DEBUG"/>
    <logger name="org.springframework" level="INFO"/>
    <logger name="org.hibernate.SQL" level="DEBUG"/>
    <logger name="org.hibernate.type.descriptor.sql.BasicBinder" level="TRACE"/>

    <!-- Root Logger -->
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="ASYNC_FILE"/>
    </root>
</configuration>
\`\`\`

---

## 📦 Stack Loki + Promtail + Grafana

### Architecture
\`\`\`
┌──────────────┐
│  DevFlow     │
│  (logs)      │
└──────┬───────┘
       │
       ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Promtail   │ ───> │     Loki     │ ───> │   Grafana    │
│  (collector) │      │   (storage)  │      │  (visualize) │
└──────────────┘      └──────────────┘      └──────────────┘
\`\`\`

### docker-compose.logging.yml

\`\`\`yaml
version: '3.8'

services:
  loki:
    image: grafana/loki:latest
    container_name: loki
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml
    volumes:
      - ./loki/loki-config.yaml:/etc/loki/local-config.yaml
      - loki-data:/loki
    networks:
      - logging

  promtail:
    image: grafana/promtail:latest
    container_name: promtail
    volumes:
      - ./promtail/promtail-config.yaml:/etc/promtail/config.yaml
      - /var/log:/var/log
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
    command: -config.file=/etc/promtail/config.yaml
    networks:
      - logging

  grafana:
    image: grafana/grafana:latest
    container_name: grafana-logs
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana/datasources:/etc/grafana/provisioning/datasources
    networks:
      - logging

volumes:
  loki-data:
  grafana-data:

networks:
  logging:
    driver: bridge
\`\`\`

### Configuration Loki

\`\`\`yaml
# loki/loki-config.yaml
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    address: 127.0.0.1
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1
    final_sleep: 0s
  chunk_idle_period: 5m
  chunk_retain_period: 30s

schema_config:
  configs:
    - from: 2023-01-01
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

storage_config:
  boltdb_shipper:
    active_index_directory: /loki/index
    cache_location: /loki/cache
    shared_store: filesystem
  filesystem:
    directory: /loki/chunks

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h  # 7 jours
  retention_period: 720h  # 30 jours

chunk_store_config:
  max_look_back_period: 720h

table_manager:
  retention_deletes_enabled: true
  retention_period: 720h
\`\`\`

### Configuration Promtail

\`\`\`yaml
# promtail/promtail-config.yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  # Logs Docker containers
  - job_name: docker
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
        refresh_interval: 5s
    relabel_configs:
      - source_labels: ['__meta_docker_container_name']
        regex: '/(.*)'
        target_label: 'container'
      - source_labels: ['__meta_docker_container_log_stream']
        target_label: 'stream'
    pipeline_stages:
      - json:
          expressions:
            level: level
            message: message
            timestamp: timestamp
      - labels:
          level:
          container:

  # Logs DevFlow backend
  - job_name: devflow-backend
    static_configs:
      - targets:
          - localhost
        labels:
          job: devflow-backend
          __path__: /var/log/devflow/application*.log
    pipeline_stages:
      - json:
          expressions:
            level: level
            logger: logger_name
            message: message
            thread: thread_name
            trace_id: trace_id
      - labels:
          level:
          logger:
      - timestamp:
          source: timestamp
          format: RFC3339

  # Logs Nginx
  - job_name: nginx
    static_configs:
      - targets:
          - localhost
        labels:
          job: nginx
          __path__: /var/log/nginx/*access.log
    pipeline_stages:
      - regex:
          expression: '^(?P<remote_addr>[\\w\\.]+) - (?P<remote_user>\\S+) \\[(?P<time_local>[^\\]]+)\\] "(?P<method>\\S+) (?P<path>\\S+) (?P<protocol>\\S+)" (?P<status>\\d+) (?P<body_bytes_sent>\\d+)'
      - labels:
          method:
          status:
          path:
\`\`\`

---

## 🔍 Queries LogQL (Loki)

\`\`\`logql
# Tous les logs du backend
{job="devflow-backend"}

# Logs d'erreur uniquement
{job="devflow-backend"} |= "ERROR"

# Logs contenant "Guide not found"
{job="devflow-backend"} |~ "Guide not found"

# Logs avec niveau ERROR
{job="devflow-backend"} | json | level="ERROR"

# Taux d'erreurs par minute
sum(rate({job="devflow-backend"} | json | level="ERROR" [1m]))

# Top 10 des erreurs
topk(10,
  sum by (message) (
    rate({job="devflow-backend"} | json | level="ERROR" [5m])
  )
)

# Logs avec latence > 1s
{job="devflow-backend"} | json | duration > 1000

# Logs par utilisateur
{job="devflow-backend"} | json | user_id="12345"
\`\`\`

---

## 📊 Stack ELK (Elasticsearch, Logstash, Kibana)

### docker-compose.elk.yml

\`\`\`yaml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
      - "9300:9300"
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data
    networks:
      - elk

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    container_name: logstash
    volumes:
      - ./logstash/logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "5044:5044"
      - "9600:9600"
    environment:
      - "LS_JAVA_OPTS=-Xms512m -Xmx512m"
    depends_on:
      - elasticsearch
    networks:
      - elk

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    container_name: kibana
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch
    networks:
      - elk

  filebeat:
    image: docker.elastic.co/beats/filebeat:8.11.0
    container_name: filebeat
    user: root
    volumes:
      - ./filebeat/filebeat.yml:/usr/share/filebeat/filebeat.yml:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    command: filebeat -e -strict.perms=false
    depends_on:
      - elasticsearch
    networks:
      - elk

volumes:
  elasticsearch-data:

networks:
  elk:
    driver: bridge
\`\`\`

### Configuration Logstash

\`\`\`ruby
# logstash/logstash.conf
input {
  beats {
    port => 5044
  }
}

filter {
  # Parser les logs JSON
  json {
    source => "message"
  }

  # Extraire le timestamp
  date {
    match => [ "timestamp", "ISO8601" ]
    target => "@timestamp"
  }

  # Ajouter des tags selon le niveau
  if [level] == "ERROR" {
    mutate {
      add_tag => [ "error" ]
    }
  }

  # Géolocalisation (si IP présente)
  if [client_ip] {
    geoip {
      source => "client_ip"
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "devflow-logs-%{+YYYY.MM.dd}"
  }

  # Aussi sortir en console pour debug
  stdout {
    codec => rubydebug
  }
}
\`\`\`

---

## 🎯 Meilleures Pratiques de Logging

### 1. Structured Logging (JSON)

\`\`\`java
// ✅ Bon
log.info("User logged in",
    kv("userId", userId),
    kv("ip", request.getRemoteAddr()),
    kv("userAgent", request.getHeader("User-Agent"))
);

// Produit:
// {"level":"INFO","message":"User logged in","userId":"12345","ip":"192.168.1.1","userAgent":"Mozilla/5.0..."}

// ❌ Mauvais
log.info("User " + userId + " logged in from " + request.getRemoteAddr());
// Difficile à parser et requêter
\`\`\`

### 2. Utiliser des Correlation IDs

\`\`\`java
@Component
public class CorrelationIdFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain) {
        String correlationId = UUID.randomUUID().toString();
        MDC.put("correlationId", correlationId);
        response.setHeader("X-Correlation-ID", correlationId);

        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.clear();
        }
    }
}
\`\`\`

### 3. Éviter les Logs Sensibles

\`\`\`java
// ❌ JAMAIS ça
log.info("User password: {}", password);
log.debug("Credit card: {}", creditCard);

// ✅ Bon
log.info("User authenticated", kv("userId", userId));
log.debug("Payment processed", kv("last4", creditCard.substring(12)));
\`\`\`

### 4. Log Sampling (Haute Volumétrie)

\`\`\`java
private final Random random = new Random();

public void processRequest(Request req) {
    // Logger seulement 10% des requêtes réussies
    if (random.nextInt(100) < 10) {
        log.debug("Request processed successfully", kv("requestId", req.getId()));
    }
}
\`\`\`

---

## 📋 Checklist Logging

### Configuration
- [ ] Niveaux de log appropriés (DEBUG en dev, INFO en prod)
- [ ] Logs au format JSON structuré
- [ ] Rotation des logs configurée
- [ ] Rétention définie (30 jours recommandé)
- [ ] Correlation IDs implémentés

### Sécurité
- [ ] Pas de données sensibles loguées
- [ ] Logs chiffrés en transit
- [ ] Accès aux logs restreint (RBAC)
- [ ] Audit des accès aux logs

### Performance
- [ ] Appenders asynchrones utilisés
- [ ] Sampling pour logs haute fréquence
- [ ] Taille des fichiers limitée
- [ ] Alertes sur volume de logs anormal

### Monitoring
- [ ] Dashboard Grafana/Kibana configuré
- [ ] Alertes sur logs d'erreur
- [ ] Recherche de logs fonctionnelle
- [ ] Exports de logs possibles

---

**Des logs bien structurés sont la clé du debugging et de l'observabilité ! 📝🔍**
`
      },

      {
        id: 'monitoring-performance',
        title: 'Optimisation des Performances',
        category: GuideCategory.MONITORING,
        icon: 'speed',
        color: '#ec4899',
        order: 3,
        tags: ['Performance', 'Optimization', 'APM', 'Profiling'],
        lastUpdated: new Date(),
        content: `# Optimisation des Performances ⚡

## 📌 Introduction

L'**optimisation des performances** est cruciale pour offrir une excellente expérience utilisateur. Ce guide couvre le monitoring, le profiling et les optimisations pour le backend et le frontend de DevFlow.

---

## 🎯 Métriques de Performance Clés

### Backend
- **Response Time** - Temps de réponse API (objectif: < 200ms P95)
- **Throughput** - Requêtes/seconde (RPS)
- **Error Rate** - Taux d'erreur (objectif: < 0.1%)
- **Database Query Time** - Temps de requête DB (objectif: < 50ms)
- **CPU Usage** - Utilisation CPU (objectif: < 70%)
- **Memory Usage** - Utilisation RAM (objectif: < 80%)

### Frontend
- **First Contentful Paint (FCP)** - Premier contenu visible (objectif: < 1.8s)
- **Largest Contentful Paint (LCP)** - Plus grand contenu visible (objectif: < 2.5s)
- **Time to Interactive (TTI)** - Temps avant interactivité (objectif: < 3.8s)
- **First Input Delay (FID)** - Délai première interaction (objectif: < 100ms)
- **Cumulative Layout Shift (CLS)** - Stabilité visuelle (objectif: < 0.1)
- **Total Bundle Size** - Taille du bundle (objectif: < 500KB)

---

## 🔍 Application Performance Monitoring (APM)

### New Relic

\`\`\`xml
<!-- pom.xml -->
<dependency>
    <groupId>com.newrelic.agent.java</groupId>
    <artifactId>newrelic-api</artifactId>
    <version>8.7.0</version>
</dependency>
\`\`\`

\`\`\`bash
# Lancer avec New Relic agent
java -javaagent:/path/to/newrelic.jar -jar devflow-backend.jar
\`\`\`

### Datadog APM

\`\`\`yaml
# docker-compose.yml
services:
  backend:
    image: devflow/backend:latest
    environment:
      - DD_AGENT_HOST=datadog-agent
      - DD_SERVICE=devflow-backend
      - DD_ENV=production
      - DD_VERSION=1.0.0
      - DD_TRACE_ENABLED=true
    volumes:
      - ./dd-java-agent.jar:/dd-java-agent.jar
    command: java -javaagent:/dd-java-agent.jar -jar app.jar

  datadog-agent:
    image: datadog/agent:latest
    environment:
      - DD_API_KEY=\${DD_API_KEY}
      - DD_SITE=datadoghq.com
      - DD_APM_ENABLED=true
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /proc/:/host/proc/:ro
      - /sys/fs/cgroup/:/host/sys/fs/cgroup:ro
\`\`\`

---

## 🚀 Optimisations Backend (Spring Boot)

### 1. Connection Pool Optimisé

\`\`\`yaml
# application.yml
spring:
  datasource:
    hikari:
      # Taille du pool basée sur la formule: cores * 2 + disks
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
      # Détection des connexions mortes
      connection-test-query: SELECT 1
\`\`\`

### 2. Cache avec Redis

\`\`\`java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))
            .serializeKeysWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    new StringRedisSerializer()
                )
            )
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    new GenericJackson2JsonRedisSerializer()
                )
            );

        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(config)
            .build();
    }
}

@Service
public class GuideService {

    @Cacheable(value = "guides", key = "#id")
    public Guide getGuide(String id) {
        return guideRepository.findById(id)
            .orElseThrow(() -> new GuideNotFoundException(id));
    }

    @CacheEvict(value = "guides", key = "#guide.id")
    public Guide updateGuide(Guide guide) {
        return guideRepository.save(guide);
    }
}
\`\`\`

### 3. Pagination & Lazy Loading

\`\`\`java
// ❌ Mauvais - Charge tout en mémoire
@GetMapping("/guides")
public List<Guide> getAllGuides() {
    return guideRepository.findAll();  // Peut retourner 10000+ guides!
}

// ✅ Bon - Pagination
@GetMapping("/guides")
public Page<GuideDTO> getGuides(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @RequestParam(defaultValue = "lastUpdated,desc") String sort
) {
    Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "lastUpdated"));
    Page<Guide> guidePage = guideRepository.findAll(pageable);
    return guidePage.map(guideMapper::toDTO);
}
\`\`\`

### 4. Requêtes N+1 - Utiliser JOIN FETCH

\`\`\`java
// ❌ Mauvais - Problème N+1
@GetMapping("/guides-with-tags")
public List<Guide> getGuidesWithTags() {
    List<Guide> guides = guideRepository.findAll();  // 1 requête
    guides.forEach(guide -> guide.getTags().size()); // N requêtes!
    return guides;
}

// ✅ Bon - JOIN FETCH
@Query("SELECT DISTINCT g FROM Guide g LEFT JOIN FETCH g.tags")
List<Guide> findAllWithTags();  // 1 seule requête!
\`\`\`

### 5. Async Processing

\`\`\`java
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean
    public ThreadPoolTaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("async-");
        executor.initialize();
        return executor;
    }
}

@Service
public class NotificationService {

    @Async
    public CompletableFuture<Void> sendWelcomeEmail(User user) {
        // Traitement long en arrière-plan
        emailService.send(user.getEmail(), "Welcome", "...");
        return CompletableFuture.completedFuture(null);
    }
}
\`\`\`

### 6. Database Indexing

\`\`\`sql
-- Index sur les colonnes fréquemment recherchées
CREATE INDEX idx_guide_category ON guides(category);
CREATE INDEX idx_guide_tags ON guide_tags(tag_name);
CREATE INDEX idx_user_email ON users(email);

-- Index composite pour recherche avancée
CREATE INDEX idx_guide_category_updated ON guides(category, last_updated DESC);

-- Analyser les requêtes lentes
EXPLAIN ANALYZE SELECT * FROM guides WHERE category = 'BACKEND' ORDER BY last_updated DESC LIMIT 20;
\`\`\`

---

## 🎨 Optimisations Frontend (Angular)

### 1. Lazy Loading des Modules

\`\`\`typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'guide/:id',
    loadComponent: () => import('./components/guide-viewer/guide-viewer.component')
      .then(m => m.GuideViewerComponent)
  }
];
\`\`\`

### 2. OnPush Change Detection

\`\`\`typescript
@Component({
  selector: 'app-guide-card',
  changeDetection: ChangeDetectionStrategy.OnPush,  // ✅ Optimisation
  template: \`
    <div class="guide-card">
      <h3>{{ guide.title }}</h3>
      <p>{{ guide.category }}</p>
    </div>
  \`
})
export class GuideCardComponent {
  @Input() guide!: Guide;
}
\`\`\`

### 3. TrackBy dans *ngFor

\`\`\`typescript
// ❌ Mauvais - Recrée tous les éléments DOM à chaque changement
<div *ngFor="let guide of guides">
  {{ guide.title }}
</div>

// ✅ Bon - Utilise trackBy pour identifier les éléments
<div *ngFor="let guide of guides; trackBy: trackByGuideId">
  {{ guide.title }}
</div>

// Component
trackByGuideId(index: number, guide: Guide): string {
  return guide.id;
}
\`\`\`

### 4. Virtual Scrolling (longues listes)

\`\`\`typescript
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  template: \`
    <cdk-virtual-scroll-viewport itemSize="100" class="guide-list">
      <div *cdkVirtualFor="let guide of guides" class="guide-item">
        <app-guide-card [guide]="guide"></app-guide-card>
      </div>
    </cdk-virtual-scroll-viewport>
  \`
})
export class GuideListComponent {
  guides: Guide[] = [];  // Peut contenir 10000+ items
}
\`\`\`

### 5. Image Optimization

\`\`\`html
<!-- ✅ Utiliser NgOptimizedImage -->
<img
  ngSrc="/assets/banner.jpg"
  width="800"
  height="400"
  priority  <!-- Pour images above-the-fold -->
  alt="DevFlow Banner"
>

<!-- Lazy loading pour images below-the-fold -->
<img
  ngSrc="/assets/guide-thumbnail.jpg"
  width="300"
  height="200"
  loading="lazy"
  alt="Guide thumbnail"
>
\`\`\`

### 6. Bundle Size Optimization

\`\`\`json
// angular.json
{
  "projects": {
    "devflow": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "buildOptimizer": true,
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "6kb",
                  "maximumError": "10kb"
                }
              ]
            }
          }
        }
      }
    }
  }
}
\`\`\`

### 7. Service Worker & PWA

\`\`\`bash
# Ajouter le support PWA
ng add @angular/pwa

# Cache les assets statiques
\`\`\`

\`\`\`json
// ngsw-config.json
{
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/*.css",
          "/*.js"
        ]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/assets/**",
          "/*.(eot|svg|cur|jpg|png|webp|gif|otf|ttf|woff|woff2|ani)"
        ]
      }
    }
  ]
}
\`\`\`

---

## 📊 Performance Profiling

### Backend - VisualVM

\`\`\`bash
# Démarrer l'app avec JMX
java -Dcom.sun.management.jmxremote \\
     -Dcom.sun.management.jmxremote.port=9010 \\
     -Dcom.sun.management.jmxremote.authenticate=false \\
     -Dcom.sun.management.jmxremote.ssl=false \\
     -jar devflow-backend.jar

# Se connecter avec VisualVM
jvisualvm
# Ajouter connection JMX: localhost:9010
\`\`\`

### Frontend - Chrome DevTools

\`\`\`bash
# Performance tab
1. Ouvrir DevTools (F12)
2. Aller dans "Performance"
3. Cliquer "Record"
4. Effectuer l'action à profiler
5. Arrêter l'enregistrement
6. Analyser:
   - Scripting time
   - Rendering time
   - Painting time
   - Loading time

# Lighthouse
1. Ouvrir DevTools (F12)
2. Aller dans "Lighthouse"
3. Sélectionner "Performance"
4. Cliquer "Analyze page load"
5. Voir les recommandations
\`\`\`

### Webpack Bundle Analyzer

\`\`\`bash
# Analyser la taille du bundle
npm install --save-dev webpack-bundle-analyzer

# Générer le rapport
ng build --stats-json
npx webpack-bundle-analyzer dist/devflow/stats.json
\`\`\`

---

## 🔧 Load Testing

### K6 (Grafana)

\`\`\`javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Ramp up to 200 users
    { duration: '5m', target: 200 },  // Stay at 200 users
    { duration: '2m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'],  // 95% of requests < 500ms
    'http_req_failed': ['rate<0.01'],    // Error rate < 1%
  },
};

export default function () {
  // Test GET /guides
  let res = http.get('https://devflow.com/api/guides');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Test GET /guide/:id
  res = http.get('https://devflow.com/api/guides/backend-intro');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'has guide data': (r) => r.json('title') !== undefined,
  });

  sleep(1);
}
\`\`\`

\`\`\`bash
# Lancer le test
k6 run load-test.js

# Avec output vers InfluxDB (monitoring)
k6 run --out influxdb=http://localhost:8086/k6 load-test.js
\`\`\`

---

## 📋 Checklist Performance

### Backend
- [ ] Connection pool optimisé
- [ ] Cache Redis implémenté
- [ ] Pagination sur toutes les listes
- [ ] Pas de requêtes N+1
- [ ] Index database sur colonnes critiques
- [ ] Async processing pour tâches longues
- [ ] Logs asynchrones
- [ ] APM configuré (New Relic/Datadog)

### Frontend
- [ ] Lazy loading des routes
- [ ] OnPush change detection
- [ ] TrackBy dans *ngFor
- [ ] Virtual scrolling pour longues listes
- [ ] Images optimisées (NgOptimizedImage)
- [ ] Bundle size < 500KB
- [ ] Service Worker activé
- [ ] Lighthouse score > 90

### Infrastructure
- [ ] CDN pour assets statiques
- [ ] Compression Gzip/Brotli activée
- [ ] HTTP/2 activé
- [ ] Cache headers configurés
- [ ] Load balancer configuré
- [ ] Auto-scaling activé

### Monitoring
- [ ] Métriques temps réel
- [ ] Alertes performance
- [ ] Load testing régulier
- [ ] Profiling périodique

---

**L'optimisation des performances est un processus continu - mesurez, optimisez, répétez ! ⚡📊**
`
      }
    ];

    this.guidesSubject.next(guides);
  }

  getGuides(): Observable<Guide[]> {
    return this.guides$;
  }

  getGuideById(id: string): Guide | undefined {
    return this.guidesSubject.value.find(g => g.id === id);
  }

  getGuidesByCategory(category: GuideCategory): Guide[] {
    return this.guidesSubject.value
      .filter(g => g.category === category)
      .sort((a, b) => a.order - b.order);
  }

  searchGuides(query: string): Guide[] {
    const lowerQuery = query.toLowerCase();
    return this.guidesSubject.value.filter(guide =>
      guide.title.toLowerCase().includes(lowerQuery) ||
      guide.content.toLowerCase().includes(lowerQuery) ||
      guide.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  markAsViewed(id: string): void {
    const guides = this.guidesSubject.value.map(guide =>
      guide.id === id ? { ...guide, isViewed: true } : guide
    );
    this.guidesSubject.next(guides);
  }
}
