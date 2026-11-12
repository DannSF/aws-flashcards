import type { Flashcard } from "../types";
export const CONTENT_VERSION = "1.0.0";
export const cards: Flashcard[] = [
  {
    id: "clf-001",
    service: "Variable expense",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "Which cloud benefit replaces large upfront infrastructure purchases with usage-based spending?",
    answer: "Variable expense",
    explanation:
      "La nube permite cambiar gastos de capital por gastos variables según el uso.",
    keywords: ["Variable expense", "Cloud value"],
    example:
      "Una startup alquila cómputo por horas en vez de comprar servidores.",
    confusion:
      "Economies of scale reduce unit costs; variable expense changes how spending is incurred.",
    mnemonic: "Variable = varía con tu consumo, no con una compra inicial.",
    difficulty: "Foundation",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-002",
    service: "Economies of scale",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "What allows AWS to offer lower variable costs through aggregated customer usage?",
    answer: "Economies of scale",
    explanation:
      "AWS agrega la demanda de muchos clientes para conseguir economías de escala.",
    keywords: ["Economies of scale", "Cloud value"],
    example:
      "Una empresa pequeña accede a infraestructura sin construir un centro de datos.",
    confusion:
      "Elasticity adjusts capacity; economies of scale concern aggregate purchasing and operating efficiency.",
    mnemonic:
      "Scale = muchos clientes comparten la ventaja de una gran escala.",
    difficulty: "Foundation",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-003",
    service: "Elasticity",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "A retailer adds capacity during a sale and removes it afterward. Which cloud concept is demonstrated?",
    answer: "Elasticity",
    explanation:
      "La elasticidad ajusta recursos a los cambios de demanda, tanto hacia arriba como hacia abajo.",
    keywords: ["Elasticity", "Cloud value"],
    example: "Una tienda reduce sus instancias cuando termina Black Friday.",
    confusion:
      "Scalability is the ability to grow; elasticity emphasizes matching changing demand.",
    mnemonic: "Elasticidad = una goma que se estira y vuelve a encogerse.",
    difficulty: "Applied",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-004",
    service: "Scalability",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "An application must support ten times more users over the next year. What capability is needed?",
    answer: "Scalability",
    explanation:
      "La escalabilidad permite aumentar la capacidad para atender más demanda.",
    keywords: ["Scalability", "Cloud value"],
    example: "Un servicio añade servidores al crecer su número de usuarios.",
    confusion:
      "High availability concerns uptime, rather than capacity growth.",
    mnemonic: "Scale up or out = crecer hacia arriba o hacia los lados.",
    difficulty: "Applied",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-005",
    service: "Multi-AZ architecture",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "Which design keeps an application available if one Availability Zone fails?",
    answer: "Multi-AZ architecture",
    explanation:
      "Distribuir la aplicación entre zonas reduce el impacto de una falla de zona.",
    keywords: ["Multi-AZ architecture", "Cloud value"],
    example: "Un balanceador envía tráfico a servidores en dos zonas.",
    confusion:
      "Multiple subnets in the same AZ do not protect against an AZ outage.",
    mnemonic: "Multi-AZ = varias zonas, menos dependencia de una sola.",
    difficulty: "Applied",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-006",
    service: "A geographic area containing multiple Availability Zones",
    domain: "cloud",
    category: "Concepts & architecture",
    question: "What is an AWS Region?",
    answer: "A geographic area containing multiple Availability Zones",
    explanation:
      "Una región es una ubicación geográfica con varias zonas de disponibilidad.",
    keywords: [
      "A geographic area containing multiple Availability Zones",
      "Cloud value",
    ],
    example:
      "Una empresa selecciona una región cercana a sus usuarios y adecuada para sus requisitos de datos.",
    confusion:
      "An edge location caches or processes traffic near users; it is not a Region.",
    mnemonic: "Region = una región del mapa; AZ = una zona dentro de ella.",
    difficulty: "Foundation",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-007",
    service: "One or more discrete data centers within a Region",
    domain: "cloud",
    category: "Concepts & architecture",
    question: "What is an Availability Zone?",
    answer: "One or more discrete data centers within a Region",
    explanation:
      "Una zona incluye uno o más centros de datos con energía y conectividad redundantes.",
    keywords: [
      "One or more discrete data centers within a Region",
      "Cloud value",
    ],
    example: "Una base de datos mantiene una réplica de espera en otra zona.",
    confusion: "An AZ is not the same as an AWS Region.",
    mnemonic: "AZ = zona aislada, no todo un país.",
    difficulty: "Foundation",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-008",
    service: "Edge location",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "Which AWS infrastructure location helps deliver cached content close to users?",
    answer: "Edge location",
    explanation:
      "Las ubicaciones de borde acercan contenido y respuestas a los usuarios.",
    keywords: ["Edge location", "Cloud value"],
    example:
      "CloudFront sirve imágenes desde una ubicación cercana al visitante.",
    confusion: "Availability Zones primarily host regional workloads.",
    mnemonic: "Edge = el borde de la red, más cerca del usuario.",
    difficulty: "Foundation",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-009",
    service: "Reliability",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "Which Well-Architected pillar focuses on recovering from failures and meeting demand?",
    answer: "Reliability",
    explanation:
      "La fiabilidad considera recuperación, disponibilidad y adaptación de la carga.",
    keywords: ["Reliability", "Cloud value"],
    example: "Un sistema prueba restauraciones de sus copias de seguridad.",
    confusion:
      "Operational excellence focuses on running and improving operations.",
    mnemonic: "Reliability = recuperar y seguir siendo fiable.",
    difficulty: "Foundation",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-010",
    service: "Cost optimization",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "Which Well-Architected pillar focuses on avoiding unnecessary spending?",
    answer: "Cost optimization",
    explanation:
      "La optimización de costos busca entregar valor con el gasto adecuado.",
    keywords: ["Cost optimization", "Cloud value"],
    example:
      "Una empresa elimina volúmenes sin uso y ajusta instancias sobredimensionadas.",
    confusion:
      "Performance efficiency focuses on efficient resource selection for performance.",
    mnemonic: "Cost = que cada recurso justifique su gasto.",
    difficulty: "Foundation",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-011",
    service: "Operational excellence",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "Which Well-Architected pillar emphasizes procedures, observability, and continuous improvement?",
    answer: "Operational excellence",
    explanation:
      "La excelencia operativa mejora los procesos y la operación de las cargas.",
    keywords: ["Operational excellence", "Cloud value"],
    example: "Un equipo automatiza procedimientos de respuesta a incidentes.",
    confusion:
      "Reliability focuses on a workload performing its intended function consistently.",
    mnemonic: "Operations = observar, aprender y mejorar el proceso.",
    difficulty: "Foundation",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-012",
    service: "Sustainability",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "Which Well-Architected pillar addresses minimizing the environmental impact of workloads?",
    answer: "Sustainability",
    explanation:
      "La sostenibilidad busca reducir recursos y energía necesarios para obtener resultados.",
    keywords: ["Sustainability", "Cloud value"],
    example:
      "Un equipo reduce capacidad ociosa y conserva solo datos necesarios.",
    confusion:
      "Cost optimization can overlap but specifically addresses financial value.",
    mnemonic: "Sustainability = hacer más trabajo con menos recursos.",
    difficulty: "Foundation",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-013",
    service: "Security",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "Which Well-Architected pillar addresses protecting data, systems, and assets?",
    answer: "Security",
    explanation:
      "La seguridad incluye identidades, protección de datos y respuesta ante incidentes.",
    keywords: ["Security", "Cloud value"],
    example: "Una empresa aplica mínimo privilegio y cifra datos sensibles.",
    confusion:
      "Reliability addresses failures; security addresses protection against threats.",
    mnemonic: "Security = proteger identidades, sistemas y datos.",
    difficulty: "Foundation",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-014",
    service: "Performance efficiency",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "Which Well-Architected pillar focuses on selecting and adapting resources to meet performance needs?",
    answer: "Performance efficiency",
    explanation:
      "La eficiencia del rendimiento utiliza recursos adecuados y evoluciona con los requisitos.",
    keywords: ["Performance efficiency", "Cloud value"],
    example:
      "Un equipo prueba familias de instancias para una carga intensiva en memoria.",
    confusion:
      "Cost optimization considers spending rather than performance requirements alone.",
    mnemonic: "Performance = el recurso correcto para rendir bien.",
    difficulty: "Foundation",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-015",
    service: "Continuing operation despite component failures",
    domain: "cloud",
    category: "Concepts & architecture",
    question: "What does fault tolerance mean?",
    answer: "Continuing operation despite component failures",
    explanation:
      "La tolerancia a fallos mantiene la operación cuando falla un componente.",
    keywords: [
      "Continuing operation despite component failures",
      "Cloud value",
    ],
    example:
      "Una aplicación replica componentes críticos y continúa ante una falla.",
    confusion:
      "High availability reduces downtime; fault tolerance aims to continue through failures.",
    mnemonic: "Tolerancia = seguir funcionando aunque una pieza falle.",
    difficulty: "Foundation",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-016",
    service: "Recovery point objective (RPO)",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "Which disaster recovery metric specifies the maximum acceptable data loss measured in time?",
    answer: "Recovery point objective (RPO)",
    explanation:
      "El RPO indica cuánto historial de datos se puede perder como máximo.",
    keywords: ["Recovery point objective (RPO)", "Cloud value"],
    example:
      "Un RPO de 15 minutos requiere recuperar datos con esa antigüedad máxima.",
    confusion: "RTO measures the acceptable time to restore service.",
    mnemonic: "RPO: Point = hasta qué punto de los datos puedo volver.",
    difficulty: "Foundation",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-017",
    service: "Recovery time objective (RTO)",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "Which disaster recovery metric specifies the maximum acceptable restoration time?",
    answer: "Recovery time objective (RTO)",
    explanation:
      "El RTO define cuánto puede tardar la recuperación del servicio.",
    keywords: ["Recovery time objective (RTO)", "Cloud value"],
    example: "Una empresa requiere restaurar su aplicación en dos horas.",
    confusion: "RPO measures acceptable data loss, not recovery duration.",
    mnemonic: "RTO: Time = cuánto tiempo puedo tardar en volver.",
    difficulty: "Foundation",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-018",
    service: "Backup and restore",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "Which disaster recovery strategy restores infrastructure and data from saved backups after a disaster?",
    answer: "Backup and restore",
    explanation:
      "Se guardan copias y se reconstruye la carga tras el desastre; la restauración debe probarse.",
    keywords: ["Backup and restore", "Cloud value"],
    example:
      "Una empresa restaura su base de datos y despliega la aplicación con plantillas.",
    confusion:
      "Pilot light keeps core components running in the recovery environment.",
    mnemonic: "Backup = guardar primero, reconstruir después.",
    difficulty: "Foundation",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-019",
    service: "Rehost",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "Which migration strategy moves an application to AWS with minimal architectural change?",
    answer: "Rehost",
    explanation:
      "Rehost mueve la aplicación casi sin cambios, también llamado lift and shift.",
    keywords: ["Rehost", "Cloud value"],
    example: "Una empresa traslada máquinas virtuales a EC2.",
    confusion:
      "Refactor changes the architecture to use cloud-native capabilities.",
    mnemonic: "Rehost = otra casa, casi los mismos muebles.",
    difficulty: "Applied",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-020",
    service: "Refactor or re-architect",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "Which migration strategy redesigns an application to use cloud-native capabilities?",
    answer: "Refactor or re-architect",
    explanation:
      "Refactor modifica la arquitectura para aprovechar capacidades de la nube.",
    keywords: ["Refactor or re-architect", "Cloud value"],
    example:
      "Un monolito se transforma en servicios con Lambda y bases administradas.",
    confusion:
      "Replatform makes limited optimizations without a fundamental redesign.",
    mnemonic: "Refactor = rediseñar los muebles para la nueva casa.",
    difficulty: "Applied",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-021",
    service: "AWS Cloud Adoption Framework (AWS CAF)",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "Which framework organizes cloud adoption around business, people, governance, platform, security, and operations?",
    answer: "AWS Cloud Adoption Framework (AWS CAF)",
    explanation:
      "AWS CAF estructura capacidades necesarias para la transformación a la nube.",
    keywords: ["AWS Cloud Adoption Framework (AWS CAF)", "Cloud value"],
    example:
      "Una organización evalúa habilidades, gobierno y operaciones antes de migrar.",
    confusion:
      "Well-Architected evaluates workloads through architectural pillars.",
    mnemonic: "CAF = adopción organizativa; no solo tecnología.",
    difficulty: "Foundation",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-022",
    service: "AWS Application Discovery Service",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "Which tool helps discover on-premises servers for migration planning?",
    answer: "AWS Application Discovery Service",
    explanation:
      "Recopila información de servidores locales para planificar migraciones.",
    keywords: ["AWS Application Discovery Service", "Cloud value"],
    example: "Un equipo identifica dependencias y utilización antes de migrar.",
    confusion:
      "Application Migration Service performs server migration rather than only discovery.",
    mnemonic: "Discovery = descubrir antes de decidir la mudanza.",
    difficulty: "Foundation",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-023",
    service: "AWS Application Migration Service",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "Which service helps move physical servers and virtual machines to AWS through replication?",
    answer: "AWS Application Migration Service",
    explanation: "Replica servidores de origen y ayuda a migrarlos a AWS.",
    keywords: ["AWS Application Migration Service", "Cloud value"],
    example:
      "Una empresa prueba la migración de sus servidores antes del corte.",
    confusion: "Database Migration Service specializes in database migration.",
    mnemonic: "Application Migration = mover servidores completos.",
    difficulty: "Foundation",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-024",
    service: "AWS Database Migration Service (AWS DMS)",
    domain: "cloud",
    category: "Concepts & architecture",
    question:
      "Which migration service transfers databases while keeping the source operational during replication?",
    answer: "AWS Database Migration Service (AWS DMS)",
    explanation:
      "DMS ayuda a migrar bases y puede replicar cambios para reducir la interrupción.",
    keywords: ["AWS Database Migration Service (AWS DMS)", "Cloud value"],
    example: "Una empresa replica datos hacia RDS antes del cambio final.",
    confusion: "Schema Conversion Tool helps convert schemas; DMS moves data.",
    mnemonic: "DMS: la D de Database recuerda que mueve datos.",
    difficulty: "Applied",
    tags: ["cloud", "CLF-C02"],
  },
  {
    id: "clf-025",
    service: "AWS",
    domain: "security",
    category: "Security & compliance",
    question:
      "Under the shared responsibility model, who protects AWS physical data centers?",
    answer: "AWS",
    explanation:
      "AWS se encarga de la seguridad de la nube, incluida la infraestructura física.",
    keywords: ["AWS", "Security"],
    example: "AWS controla el acceso físico a sus instalaciones.",
    confusion:
      "Customers remain responsible for their data and access permissions.",
    mnemonic: "AWS protege el edificio; tú proteges lo que construyes dentro.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-026",
    service: "The customer",
    domain: "security",
    category: "Security & compliance",
    question:
      "Who patches the guest operating system on an Amazon EC2 instance?",
    answer: "The customer",
    explanation:
      "En EC2 el cliente administra el sistema operativo invitado y sus actualizaciones.",
    keywords: ["The customer", "Security"],
    example: "Un administrador aplica parches a Linux en sus instancias.",
    confusion:
      "For managed services such as RDS, AWS manages the underlying host operating system.",
    mnemonic: "EC2 = tu sistema invitado, tus parches.",
    difficulty: "Applied",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-027",
    service: "The customer",
    domain: "security",
    category: "Security & compliance",
    question:
      "Who is responsible for configuring access permissions to objects in Amazon S3?",
    answer: "The customer",
    explanation:
      "El cliente define permisos y políticas para proteger sus datos en S3.",
    keywords: ["The customer", "Security"],
    example:
      "Un equipo bloquea acceso público y limita una política de bucket.",
    confusion:
      "AWS securing the physical infrastructure does not configure customer data permissions.",
    mnemonic: "Tus datos, tus permisos: también en un servicio administrado.",
    difficulty: "Applied",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-028",
    service: "Least privilege",
    domain: "security",
    category: "Security & compliance",
    question: "Which IAM practice grants only permissions required for a task?",
    answer: "Least privilege",
    explanation:
      "El mínimo privilegio limita acciones, recursos y condiciones a lo necesario.",
    keywords: ["Least privilege", "Security"],
    example: "Una aplicación solo puede leer su bucket específico.",
    confusion:
      "AdministratorAccess grants broad access and is not least privilege.",
    mnemonic: "Least = lo mínimo necesario, nunca todo por comodidad.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-029",
    service: "An IAM role attached through an instance profile",
    domain: "security",
    category: "Security & compliance",
    question:
      "How should an application on EC2 obtain AWS permissions without stored long-term access keys?",
    answer: "An IAM role attached through an instance profile",
    explanation:
      "Los roles proporcionan credenciales temporales que se renuevan sin guardar claves permanentes.",
    keywords: ["An IAM role attached through an instance profile", "Security"],
    example: "Una instancia lee S3 usando su perfil de instancia.",
    confusion: "An IAM user access key is a long-term credential.",
    mnemonic:
      "Role = ponerse un rol temporal, no guardar una llave permanente.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-030",
    service: "AWS IAM Identity Center",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which service centrally manages workforce access to multiple AWS accounts and business applications?",
    answer: "AWS IAM Identity Center",
    explanation:
      "Centraliza el acceso de usuarios de una organización a cuentas y aplicaciones.",
    keywords: ["AWS IAM Identity Center", "Security"],
    example: "Los empleados acceden a varias cuentas desde un portal.",
    confusion:
      "IAM roles grant permissions; Identity Center coordinates workforce access across accounts.",
    mnemonic: "Identity Center = una puerta central para el personal.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-031",
    service: "Multi-factor authentication (MFA)",
    domain: "security",
    category: "Security & compliance",
    question:
      "What should be enabled to add a second authentication factor to an AWS root user?",
    answer: "Multi-factor authentication (MFA)",
    explanation: "MFA exige un factor adicional además de la contraseña.",
    keywords: ["Multi-factor authentication (MFA)", "Security"],
    example:
      "Un administrador protege la cuenta raíz con un dispositivo de autenticación.",
    confusion:
      "An access key is a programmatic credential, not an additional sign-in factor.",
    mnemonic: "Multi-factor = más de una prueba de identidad.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-032",
    service: "AWS account root user",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which AWS identity should be reserved for tasks that specifically require it?",
    answer: "AWS account root user",
    explanation:
      "La cuenta raíz tiene capacidades muy amplias y debe protegerse y usarse de forma excepcional.",
    keywords: ["AWS account root user", "Security"],
    example: "Un equipo usa identidades delegadas para el trabajo diario.",
    confusion:
      "An administrator IAM identity is different from the account root user.",
    mnemonic: "Root = la llave maestra: protegida y guardada.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-033",
    service: "It overrides an allow",
    domain: "security",
    category: "Security & compliance",
    question:
      "What is the effect of an applicable explicit deny in an IAM policy evaluation?",
    answer: "It overrides an allow",
    explanation:
      "Una denegación explícita aplicable prevalece sobre permisos concedidos.",
    keywords: ["It overrides an allow", "Security"],
    example: "Una política impide eliminar un bucket aunque otra permita S3.",
    confusion:
      "The absence of an allow is an implicit deny, not an explicit deny.",
    mnemonic: "Deny = un NO explícito gana al SÍ.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-034",
    service: "AWS Key Management Service (AWS KMS)",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which service manages cryptographic keys used for encryption across AWS services?",
    answer: "AWS Key Management Service (AWS KMS)",
    explanation:
      "KMS permite crear y controlar claves criptográficas para cifrar datos.",
    keywords: ["AWS Key Management Service (AWS KMS)", "Security"],
    example:
      "Una empresa cifra volúmenes EBS con una clave administrada por ella.",
    confusion:
      "Secrets Manager stores and rotates secrets rather than being the main key management service.",
    mnemonic: "KMS: Key Management = administración de claves.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-035",
    service: "AWS Secrets Manager",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which service stores database passwords and supports automated secret rotation?",
    answer: "AWS Secrets Manager",
    explanation:
      "Guarda secretos y permite configurar su rotación con integraciones compatibles.",
    keywords: ["AWS Secrets Manager", "Security"],
    example:
      "Una aplicación recupera credenciales de RDS sin incluirlas en el código.",
    confusion:
      "KMS manages encryption keys; it does not replace secret lifecycle management.",
    mnemonic: "Secrets = contraseñas fuera del código y con rotación.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-036",
    service: "AWS CloudTrail",
    domain: "security",
    category: "Security & compliance",
    question: "Which service records account API activity for auditing?",
    answer: "AWS CloudTrail",
    explanation:
      "CloudTrail registra eventos de actividad y llamadas API para auditoría.",
    keywords: ["AWS CloudTrail", "Security"],
    example: "Un auditor investiga quién eliminó un recurso.",
    confusion:
      "CloudWatch monitors metrics and logs; CloudTrail records API activity.",
    mnemonic: "Trail = el rastro de quién hizo qué.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-037",
    service: "AWS Config",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which service records resource configuration changes and evaluates compliance against rules?",
    answer: "AWS Config",
    explanation:
      "Config mantiene historial de configuración y evalúa recursos mediante reglas.",
    keywords: ["AWS Config", "Security"],
    example:
      "Una empresa detecta buckets que incumplen sus reglas de configuración.",
    confusion:
      "CloudTrail records API events, not resource compliance rule evaluations.",
    mnemonic: "Config = una foto de la configuración y su historial.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-038",
    service: "Amazon GuardDuty",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which service detects suspicious account activity and potential threats?",
    answer: "Amazon GuardDuty",
    explanation:
      "GuardDuty analiza señales para detectar amenazas y comportamientos sospechosos.",
    keywords: ["Amazon GuardDuty", "Security"],
    example:
      "Un equipo investiga hallazgos relacionados con credenciales comprometidas.",
    confusion:
      "Inspector scans for software vulnerabilities; GuardDuty detects threats.",
    mnemonic: "GuardDuty = el guardia de turno busca amenazas.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-039",
    service: "Amazon Inspector",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which service scans supported workloads for software vulnerabilities and unintended network exposure?",
    answer: "Amazon Inspector",
    explanation:
      "Inspector identifica vulnerabilidades en cargas compatibles como EC2, imágenes ECR y funciones Lambda.",
    keywords: ["Amazon Inspector", "Security"],
    example: "Un equipo recibe hallazgos sobre paquetes vulnerables en EC2.",
    confusion:
      "GuardDuty detects suspicious activity rather than acting as a package vulnerability scanner.",
    mnemonic: "Inspector = inspecciona vulnerabilidades del software.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-040",
    service: "Amazon Macie",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which service discovers sensitive data such as PII in Amazon S3?",
    answer: "Amazon Macie",
    explanation:
      "Macie utiliza aprendizaje automático y patrones para identificar datos sensibles en S3.",
    keywords: ["Amazon Macie", "Security"],
    example:
      "Una empresa busca información personal en documentos almacenados en buckets.",
    confusion:
      "Inspector assesses vulnerabilities; Macie discovers sensitive S3 data.",
    mnemonic: "Macie = una lupa sobre los datos sensibles de S3.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-041",
    service: "AWS Security Hub",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which service aggregates security findings and performs security posture checks across AWS accounts?",
    answer: "AWS Security Hub",
    explanation:
      "Security Hub centraliza hallazgos y ayuda a evaluar la postura de seguridad.",
    keywords: ["AWS Security Hub", "Security"],
    example: "Un equipo revisa hallazgos de GuardDuty e Inspector en un lugar.",
    confusion:
      "GuardDuty generates threat findings; Security Hub brings findings together.",
    mnemonic: "Hub = el centro donde se juntan los hallazgos.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-042",
    service: "AWS WAF",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which service filters web requests using rules for common application-layer exploits?",
    answer: "AWS WAF",
    explanation:
      "WAF filtra solicitudes web mediante reglas, incluidas condiciones para patrones maliciosos.",
    keywords: ["AWS WAF", "Security"],
    example: "Un sitio bloquea solicitudes con patrones de inyección SQL.",
    confusion:
      "Shield focuses on DDoS protection rather than custom web request rules.",
    mnemonic: "WAF = Web Application Firewall: filtra solicitudes web.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-043",
    service: "AWS Shield",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which AWS service provides managed distributed denial-of-service protection?",
    answer: "AWS Shield",
    explanation:
      "Shield ayuda a proteger aplicaciones frente a ataques DDoS; existen niveles Standard y Advanced.",
    keywords: ["AWS Shield", "Security"],
    example:
      "Una aplicación utiliza protección DDoS para recursos compatibles.",
    confusion: "WAF filters HTTP requests using application-level rules.",
    mnemonic: "Shield = escudo contra la avalancha DDoS.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-044",
    service: "AWS Artifact",
    domain: "security",
    category: "Security & compliance",
    question:
      "Where can a company download AWS compliance reports and agreements?",
    answer: "AWS Artifact",
    explanation:
      "Artifact ofrece acceso a informes de cumplimiento de AWS y acuerdos aplicables.",
    keywords: ["AWS Artifact", "Security"],
    example: "Un auditor descarga un informe SOC de AWS.",
    confusion: "Audit Manager helps collect evidence for customer audits.",
    mnemonic: "Artifact = documentos que entregas al auditor.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-045",
    service: "AWS Audit Manager",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which service helps continuously collect evidence for audits using frameworks?",
    answer: "AWS Audit Manager",
    explanation:
      "Audit Manager ayuda a recopilar y organizar evidencias para evaluar controles.",
    keywords: ["AWS Audit Manager", "Security"],
    example: "Un equipo prepara evidencias de su entorno para una auditoría.",
    confusion:
      "Artifact provides AWS reports; it does not collect the customer's audit evidence.",
    mnemonic: "Audit Manager = organiza las evidencias de tu auditoría.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-046",
    service: "AWS Certificate Manager (ACM)",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which service provides managed SSL/TLS certificates for compatible AWS services?",
    answer: "AWS Certificate Manager (ACM)",
    explanation:
      "ACM administra certificados para integraciones compatibles y facilita su renovación.",
    keywords: ["AWS Certificate Manager (ACM)", "Security"],
    example: "Un balanceador usa un certificado para conexiones HTTPS.",
    confusion:
      "KMS manages cryptographic keys for encryption rather than acting as a TLS certificate manager.",
    mnemonic: "ACM: Certificate Manager = certificados para HTTPS.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-047",
    service: "AWS CloudHSM",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which service provides dedicated hardware security modules under customer control?",
    answer: "AWS CloudHSM",
    explanation:
      "CloudHSM ofrece módulos de seguridad de hardware dedicados para requisitos específicos.",
    keywords: ["AWS CloudHSM", "Security"],
    example: "Una organización necesita controlar claves en HSM dedicados.",
    confusion:
      "KMS is a managed key service with a different operational and control model.",
    mnemonic: "HSM = hardware dedicado para custodiar claves.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-048",
    service: "Amazon Cognito",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which service adds user sign-up and sign-in to customer-facing applications?",
    answer: "Amazon Cognito",
    explanation:
      "Cognito facilita autenticación de usuarios de aplicaciones web y móviles.",
    keywords: ["Amazon Cognito", "Security"],
    example: "Una app permite registro y acceso de sus clientes.",
    confusion:
      "IAM Identity Center is intended for workforce access, not customer app registration.",
    mnemonic: "Cognito = reconoce a los clientes de tu aplicación.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-049",
    service: "Security group",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which network control is stateful and attached to network interfaces of resources such as EC2?",
    answer: "Security group",
    explanation:
      "Los grupos de seguridad son firewalls con estado; las respuestas al tráfico permitido se admiten automáticamente.",
    keywords: ["Security group", "Security"],
    example: "Una instancia acepta HTTPS solo desde el balanceador.",
    confusion: "Network ACLs operate at subnet level and are stateless.",
    mnemonic: "Security group = portero con memoria de la conversación.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-050",
    service: "Network ACL",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which network control is stateless and applies at the subnet boundary?",
    answer: "Network ACL",
    explanation:
      "Las ACL de red controlan tráfico de subred con reglas de permitir y denegar; requieren considerar ambas direcciones.",
    keywords: ["Network ACL", "Security"],
    example:
      "Una subred bloquea un rango de direcciones mediante una regla de denegación.",
    confusion: "Security groups are stateful and use allow rules.",
    mnemonic: "NACL = portero de subred sin memoria: revisa ida y vuelta.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-051",
    service: "Service control policy (SCP)",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which Organizations policy sets maximum available permissions in member accounts without granting permissions?",
    answer: "Service control policy (SCP)",
    explanation:
      "Una SCP limita permisos disponibles; las identidades aún necesitan permisos IAM.",
    keywords: ["Service control policy (SCP)", "Security"],
    example:
      "Una organización impide a cuentas miembro utilizar ciertas regiones.",
    confusion:
      "An IAM identity policy can grant permissions; an SCP alone cannot.",
    mnemonic: "SCP = techo de permisos; no una concesión de acceso.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-052",
    service: "AWS Firewall Manager",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which service helps centrally manage firewall policies across an organization?",
    answer: "AWS Firewall Manager",
    explanation:
      "Firewall Manager ayuda a aplicar políticas de protección de forma centralizada en cuentas y recursos compatibles.",
    keywords: ["AWS Firewall Manager", "Security"],
    example: "Un equipo distribuye reglas WAF a varias cuentas.",
    confusion:
      "WAF evaluates individual web requests; Firewall Manager manages policy deployment.",
    mnemonic:
      "Firewall Manager = el coordinador de políticas de los firewalls.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-053",
    service: "Encryption in transit using TLS",
    domain: "security",
    category: "Security & compliance",
    question:
      "What encryption protects data while it travels between a client and an HTTPS endpoint?",
    answer: "Encryption in transit using TLS",
    explanation:
      "TLS protege datos durante la transmisión entre extremos compatibles.",
    keywords: ["Encryption in transit using TLS", "Security"],
    example: "Un navegador se conecta a una aplicación mediante HTTPS.",
    confusion:
      "Encryption at rest protects stored data, such as objects or volumes.",
    mnemonic: "In transit = datos viajando dentro de un túnel TLS.",
    difficulty: "Foundation",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-054",
    service: "S3 Block Public Access",
    domain: "security",
    category: "Security & compliance",
    question:
      "Which practice reduces the risk of unintended public access to S3 data?",
    answer: "S3 Block Public Access",
    explanation:
      "Block Public Access ayuda a bloquear permisos públicos en buckets y puntos de acceso.",
    keywords: ["S3 Block Public Access", "Security"],
    example:
      "Una organización evita publicar accidentalmente documentos internos.",
    confusion:
      "Encryption protects confidentiality of stored bytes but does not replace access control.",
    mnemonic:
      "Block Public = cierra la puerta pública, no solo cifra el contenido.",
    difficulty: "Applied",
    tags: ["security", "CLF-C02"],
  },
  {
    id: "clf-055",
    service: "Amazon EC2",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service provides resizable virtual servers with operating system control?",
    answer: "Amazon EC2",
    explanation:
      "EC2 proporciona servidores virtuales configurables cuyo sistema operativo administra el cliente.",
    keywords: ["Amazon EC2", "Managed services"],
    example:
      "Una empresa ejecuta un servidor de aplicación con software personalizado.",
    confusion: "Lambda executes functions without customer-managed servers.",
    mnemonic: "EC2 = un servidor virtual bajo tu control.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-056",
    service: "AWS Lambda",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service executes event-driven code without provisioning servers?",
    answer: "AWS Lambda",
    explanation:
      "Lambda ejecuta funciones ante eventos y administra la infraestructura subyacente.",
    keywords: ["AWS Lambda", "Managed services"],
    example: "Una función procesa una imagen cuando llega a S3.",
    confusion:
      "EC2 requires managing virtual server capacity and the guest operating system.",
    mnemonic: "Lambda = función que despierta con un evento.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-057",
    service: "Amazon ECS",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service orchestrates Docker-compatible containers using AWS-native constructs?",
    answer: "Amazon ECS",
    explanation:
      "ECS administra tareas y servicios de contenedores integrados con AWS.",
    keywords: ["Amazon ECS", "Managed services"],
    example: "Una empresa ejecuta una API en contenedores mediante tareas ECS.",
    confusion:
      "EKS provides managed Kubernetes rather than the ECS orchestration API.",
    mnemonic: "ECS = contenedores con el lenguaje propio de AWS.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-058",
    service: "Amazon EKS",
    domain: "technology",
    category: "Services & infrastructure",
    question: "Which service provides a managed Kubernetes control plane?",
    answer: "Amazon EKS",
    explanation:
      "EKS administra el plano de control de Kubernetes para ejecutar aplicaciones en contenedores.",
    keywords: ["Amazon EKS", "Managed services"],
    example: "Un equipo migra aplicaciones que ya usan Kubernetes.",
    confusion:
      "ECS is an alternative container orchestrator with AWS-native APIs.",
    mnemonic: "EKS: la K te recuerda Kubernetes.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-059",
    service: "AWS Fargate",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which compute option runs ECS tasks or EKS pods without managing EC2 worker servers?",
    answer: "AWS Fargate",
    explanation:
      "Fargate proporciona capacidad de cómputo sin administrar los servidores de los contenedores.",
    keywords: ["AWS Fargate", "Managed services"],
    example:
      "Un equipo despliega tareas ECS sin mantener un grupo de instancias.",
    confusion: "Fargate supplies compute; ECS and EKS orchestrate containers.",
    mnemonic: "Fargate = contenedores sin cuidar los servidores.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-060",
    service: "AWS Elastic Beanstalk",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service deploys web applications while handling capacity, load balancing, and health monitoring?",
    answer: "AWS Elastic Beanstalk",
    explanation:
      "Beanstalk automatiza el despliegue y administración de infraestructura para aplicaciones compatibles.",
    keywords: ["AWS Elastic Beanstalk", "Managed services"],
    example:
      "Un desarrollador sube una aplicación y Beanstalk prepara su entorno.",
    confusion:
      "CloudFormation is general-purpose infrastructure as code rather than an application platform workflow.",
    mnemonic: "Beanstalk = sube tu app y deja crecer su entorno.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-061",
    service: "Amazon EC2 Auto Scaling",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service adjusts the number of EC2 instances in response to demand?",
    answer: "Amazon EC2 Auto Scaling",
    explanation:
      "Auto Scaling mantiene y ajusta grupos de instancias mediante políticas y comprobaciones de salud.",
    keywords: ["Amazon EC2 Auto Scaling", "Managed services"],
    example: "Una aplicación añade instancias cuando sube la utilización.",
    confusion:
      "Elastic Load Balancing distributes traffic rather than creating the required instances itself.",
    mnemonic: "Auto Scaling = cambia cuántos servidores trabajan.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-062",
    service: "Amazon Lightsail",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service offers simplified virtual private servers with bundled pricing?",
    answer: "Amazon Lightsail",
    explanation:
      "Lightsail simplifica servidores y recursos para proyectos con necesidades previsibles.",
    keywords: ["Amazon Lightsail", "Managed services"],
    example: "Una pequeña empresa aloja un sitio sencillo con un plan mensual.",
    confusion: "EC2 offers broader configuration and integration options.",
    mnemonic: "Lightsail = navegación sencilla para un proyecto pequeño.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-063",
    service: "Amazon S3",
    domain: "technology",
    category: "Services & infrastructure",
    question: "Which AWS storage service stores objects in buckets?",
    answer: "Amazon S3",
    explanation:
      "S3 almacena objetos con metadatos y claves, adecuado para contenido y datos a gran escala.",
    keywords: ["Amazon S3", "Managed services"],
    example: "Una app guarda imágenes y copias de seguridad.",
    confusion: "EBS provides block storage, not object storage.",
    mnemonic: "S3 = objetos en buckets, no discos montados.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-064",
    service: "Amazon EBS",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which storage provides persistent block volumes for EC2 instances?",
    answer: "Amazon EBS",
    explanation:
      "EBS proporciona almacenamiento en bloques asociado a una zona de disponibilidad.",
    keywords: ["Amazon EBS", "Managed services"],
    example:
      "Una instancia usa un volumen para su sistema operativo y base de datos.",
    confusion: "EFS is shared file storage rather than a block volume.",
    mnemonic: "EBS = bloques para tu instancia.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-065",
    service: "Amazon EFS",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service provides shared elastic NFS file storage for Linux workloads?",
    answer: "Amazon EFS",
    explanation:
      "EFS ofrece un sistema de archivos compartido accesible desde varias instancias.",
    keywords: ["Amazon EFS", "Managed services"],
    example: "Varios servidores Linux comparten archivos de una aplicación.",
    confusion:
      "S3 uses object APIs rather than a native NFS file system interface.",
    mnemonic: "EFS = archivos compartidos con NFS.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-066",
    service: "Amazon FSx for Windows File Server",
    domain: "technology",
    category: "Services & infrastructure",
    question: "Which service offers managed Windows file storage using SMB?",
    answer: "Amazon FSx for Windows File Server",
    explanation:
      "FSx for Windows File Server proporciona almacenamiento de archivos Windows administrado.",
    keywords: ["Amazon FSx for Windows File Server", "Managed services"],
    example:
      "Una empresa comparte archivos con aplicaciones Windows mediante SMB.",
    confusion:
      "EFS primarily provides NFS file access rather than Windows SMB shares.",
    mnemonic: "FSx Windows = archivos Windows que hablan SMB.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-067",
    service: "S3 Glacier Deep Archive",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which S3 storage class is designed for archives rarely accessed and can require hours for restoration?",
    answer: "S3 Glacier Deep Archive",
    explanation:
      "Deep Archive reduce el costo de almacenamiento de archivos con acceso muy poco frecuente y recuperación diferida.",
    keywords: ["S3 Glacier Deep Archive", "Managed services"],
    example: "Una empresa conserva registros históricos por varios años.",
    confusion:
      "S3 Glacier Instant Retrieval supports millisecond access rather than delayed restore.",
    mnemonic:
      "Deep Archive = almacén profundo: barato de guardar, lento de sacar.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-068",
    service: "S3 Intelligent-Tiering",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which S3 class automatically moves objects among access tiers as access patterns change?",
    answer: "S3 Intelligent-Tiering",
    explanation:
      "Intelligent-Tiering adapta niveles de acceso a patrones cambiantes mediante automatización.",
    keywords: ["S3 Intelligent-Tiering", "Managed services"],
    example: "Un bucket contiene datos cuyo acceso es difícil de predecir.",
    confusion:
      "Lifecycle rules use configured conditions rather than monitoring access patterns in the same way.",
    mnemonic: "Intelligent-Tiering = los niveles siguen tus hábitos de acceso.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-069",
    service: "AWS Storage Gateway",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service connects on-premises applications to cloud storage using gateway interfaces?",
    answer: "AWS Storage Gateway",
    explanation:
      "Storage Gateway integra entornos locales con almacenamiento de AWS mediante interfaces compatibles.",
    keywords: ["AWS Storage Gateway", "Managed services"],
    example:
      "Una empresa mantiene aplicaciones locales mientras almacena datos en AWS.",
    confusion:
      "DataSync transfers datasets; Storage Gateway provides ongoing hybrid storage interfaces.",
    mnemonic: "Gateway = un puente de almacenamiento entre local y nube.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-070",
    service: "AWS DataSync",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service automates online transfers of file and object data between storage systems?",
    answer: "AWS DataSync",
    explanation:
      "DataSync simplifica y acelera transferencias de datos entre sistemas compatibles.",
    keywords: ["AWS DataSync", "Managed services"],
    example: "Una empresa copia archivos de un NAS a S3.",
    confusion:
      "Storage Gateway provides hybrid storage access rather than primarily a transfer workflow.",
    mnemonic: "DataSync = sincronizar una mudanza de datos.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-071",
    service: "S3 Versioning",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which S3 feature preserves previous versions of an object after overwrites?",
    answer: "S3 Versioning",
    explanation:
      "Versioning conserva versiones para ayudar a recuperar modificaciones o eliminaciones accidentales.",
    keywords: ["S3 Versioning", "Managed services"],
    example: "Un usuario recupera una versión anterior de un documento.",
    confusion:
      "Replication copies data to another bucket; versioning retains versions within the bucket.",
    mnemonic:
      "Versioning = no solo el documento actual: también sus versiones.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-072",
    service: "Amazon RDS",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service provides managed relational databases with familiar SQL engines?",
    answer: "Amazon RDS",
    explanation:
      "RDS automatiza tareas de bases relacionales, como copias de seguridad y administración de infraestructura.",
    keywords: ["Amazon RDS", "Managed services"],
    example: "Una aplicación utiliza PostgreSQL administrado.",
    confusion: "DynamoDB is a nonrelational key-value and document database.",
    mnemonic: "RDS = relaciones y SQL, con administración simplificada.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-073",
    service: "Amazon Aurora",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which relational database is AWS-designed and compatible with MySQL and PostgreSQL?",
    answer: "Amazon Aurora",
    explanation:
      "Aurora es un motor relacional compatible con MySQL o PostgreSQL y diseñado para la nube.",
    keywords: ["Amazon Aurora", "Managed services"],
    example:
      "Una empresa adopta Aurora conservando compatibilidad con su aplicación PostgreSQL.",
    confusion: "Aurora is part of the RDS family, not a NoSQL database.",
    mnemonic: "Aurora = relacional de AWS, con acento MySQL o PostgreSQL.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-074",
    service: "Amazon DynamoDB",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service provides a serverless key-value and document database?",
    answer: "Amazon DynamoDB",
    explanation:
      "DynamoDB es una base NoSQL administrada diseñada para acceso de baja latencia a escala.",
    keywords: ["Amazon DynamoDB", "Managed services"],
    example:
      "Una aplicación guarda carritos de compra por identificador de usuario.",
    confusion: "RDS provides relational engines and SQL semantics.",
    mnemonic:
      "DynamoDB = claves y documentos, sin servidor de base que administrar.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-075",
    service: "Amazon ElastiCache",
    domain: "technology",
    category: "Services & infrastructure",
    question: "Which service provides managed in-memory caching?",
    answer: "Amazon ElastiCache",
    explanation:
      "ElastiCache permite almacenar datos en memoria para reducir latencia y carga de bases de datos.",
    keywords: ["Amazon ElastiCache", "Managed services"],
    example: "Una aplicación almacena resultados consultados frecuentemente.",
    confusion:
      "Redshift is an analytical warehouse, not an in-memory application cache.",
    mnemonic: "Cache = recuerda en memoria para no consultar de nuevo.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-076",
    service: "Amazon Redshift",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service provides a managed data warehouse for SQL analytics?",
    answer: "Amazon Redshift",
    explanation:
      "Redshift permite análisis de grandes volúmenes de datos mediante un almacén de datos.",
    keywords: ["Amazon Redshift", "Managed services"],
    example: "Una empresa analiza ventas agregadas de varios sistemas.",
    confusion: "RDS is typically used for transactional relational workloads.",
    mnemonic:
      "Redshift = el almacén donde analizas grandes conjuntos de datos.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-077",
    service: "High availability and failover",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "What is the main purpose of an RDS Multi-AZ deployment with a standby instance?",
    answer: "High availability and failover",
    explanation:
      "Una instancia de espera en otra zona permite conmutación ante fallos; no sirve lecturas de la aplicación.",
    keywords: ["High availability and failover", "Managed services"],
    example:
      "Una base de producción necesita recuperarse ante una falla de su zona.",
    confusion:
      "Read replicas primarily scale read traffic; an ordinary Multi-AZ standby does not serve reads.",
    mnemonic:
      "Multi-AZ standby = compañero de emergencia, no lector de informes.",
    difficulty: "Applied",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-078",
    service: "Offloading read traffic",
    domain: "technology",
    category: "Services & infrastructure",
    question: "What is the main purpose of an RDS read replica?",
    answer: "Offloading read traffic",
    explanation:
      "Las réplicas de lectura permiten repartir consultas de lectura de motores compatibles.",
    keywords: ["Offloading read traffic", "Managed services"],
    example: "Una app envía consultas de informes a una réplica.",
    confusion:
      "A Multi-AZ standby primarily provides availability and failover.",
    mnemonic: "Read replica = otro lector para repartir las consultas.",
    difficulty: "Applied",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-079",
    service: "Amazon VPC",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service defines a logically isolated virtual network in AWS?",
    answer: "Amazon VPC",
    explanation:
      "VPC permite definir redes, subredes, rutas y controles de tráfico.",
    keywords: ["Amazon VPC", "Managed services"],
    example: "Una empresa separa servidores públicos y bases privadas.",
    confusion: "A subnet belongs to one AZ; a VPC spans a Region.",
    mnemonic: "VPC = tu vecindario de red virtual.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-080",
    service: "Amazon Route 53",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service provides authoritative DNS and domain registration?",
    answer: "Amazon Route 53",
    explanation:
      "Route 53 resuelve nombres y ofrece políticas de enrutamiento DNS y comprobaciones de salud.",
    keywords: ["Amazon Route 53", "Managed services"],
    example: "Un dominio dirige usuarios hacia la aplicación.",
    confusion:
      "CloudFront is a content delivery network, not the main DNS service.",
    mnemonic: "Route 53 = DNS; el 53 recuerda el puerto de DNS.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-081",
    service: "Amazon CloudFront",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service caches and delivers content through a global edge network?",
    answer: "Amazon CloudFront",
    explanation:
      "CloudFront distribuye contenido mediante ubicaciones de borde para reducir latencia.",
    keywords: ["Amazon CloudFront", "Managed services"],
    example: "Un sitio sirve imágenes a usuarios de varios países.",
    confusion:
      "Global Accelerator routes traffic using static anycast IPs rather than acting as a content cache.",
    mnemonic: "CloudFront = el contenido se acerca al frente del usuario.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-082",
    service: "AWS Direct Connect",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service provides a dedicated network connection from an on-premises location to AWS?",
    answer: "AWS Direct Connect",
    explanation:
      "Direct Connect establece conectividad dedicada; el cifrado debe diseñarse según los requisitos.",
    keywords: ["AWS Direct Connect", "Managed services"],
    example: "Una empresa necesita conectividad privada y más predecible.",
    confusion:
      "Site-to-Site VPN uses encrypted tunnels over a network such as the internet.",
    mnemonic: "Direct = conexión dedicada; no supongas cifrado automático.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-083",
    service: "AWS Site-to-Site VPN",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service connects an on-premises network to AWS using IPsec tunnels?",
    answer: "AWS Site-to-Site VPN",
    explanation:
      "Site-to-Site VPN establece túneles IPsec cifrados entre redes.",
    keywords: ["AWS Site-to-Site VPN", "Managed services"],
    example: "Una oficina conecta su red a una VPC por internet.",
    confusion:
      "Direct Connect provides dedicated connectivity and is not inherently the same as a VPN.",
    mnemonic: "VPN = túnel IPsec entre redes.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-084",
    service: "AWS Transit Gateway",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service acts as a central hub for connecting VPCs and on-premises networks?",
    answer: "AWS Transit Gateway",
    explanation:
      "Transit Gateway centraliza el enrutamiento entre múltiples redes.",
    keywords: ["AWS Transit Gateway", "Managed services"],
    example:
      "Una empresa conecta decenas de VPC sin una malla completa de enlaces.",
    confusion:
      "VPC peering directly links two VPCs and does not provide transitive routing.",
    mnemonic: "Transit = estación central para conectar muchas redes.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-085",
    service: "Elastic Load Balancing",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service distributes incoming application traffic across multiple targets?",
    answer: "Elastic Load Balancing",
    explanation:
      "ELB distribuye tráfico entre destinos saludables para mejorar disponibilidad.",
    keywords: ["Elastic Load Balancing", "Managed services"],
    example: "Una aplicación usa un ALB delante de servidores en varias zonas.",
    confusion:
      "Auto Scaling changes capacity; a load balancer distributes traffic.",
    mnemonic: "Load Balancer = reparte; Auto Scaling = aumenta o reduce.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-086",
    service: "NAT Gateway",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which component lets instances in private subnets initiate IPv4 internet connections without accepting unsolicited inbound internet traffic?",
    answer: "NAT Gateway",
    explanation:
      "Un NAT Gateway público permite salida a internet desde subredes privadas con rutas y gateway adecuados.",
    keywords: ["NAT Gateway", "Managed services"],
    example: "Servidores privados descargan actualizaciones sin IP pública.",
    confusion:
      "An internet gateway enables internet connectivity but does not perform the same private-subnet NAT function.",
    mnemonic: "NAT = salir desde lo privado sin abrir una entrada pública.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-087",
    service: "VPC endpoint",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which VPC feature provides private connectivity to supported AWS services without an internet gateway?",
    answer: "VPC endpoint",
    explanation:
      "Los endpoints permiten acceder a servicios compatibles mediante conectividad privada.",
    keywords: ["VPC endpoint", "Managed services"],
    example: "Una aplicación accede a S3 sin salir por NAT.",
    confusion:
      "A NAT gateway provides outbound address translation rather than a private service endpoint.",
    mnemonic: "Endpoint = una puerta privada al servicio compatible.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-088",
    service: "Amazon CloudWatch",
    domain: "technology",
    category: "Services & infrastructure",
    question: "Which service collects operational metrics, logs, and alarms?",
    answer: "Amazon CloudWatch",
    explanation:
      "CloudWatch ayuda a observar aplicaciones y recursos mediante métricas, registros y alarmas.",
    keywords: ["Amazon CloudWatch", "Managed services"],
    example: "Una alarma avisa cuando sube la utilización de CPU.",
    confusion: "CloudTrail records account activity and API events.",
    mnemonic: "Watch = vigilar métricas, logs y alarmas.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-089",
    service: "AWS CloudFormation",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service provisions infrastructure from declarative templates?",
    answer: "AWS CloudFormation",
    explanation:
      "CloudFormation administra recursos como una pila definida en código.",
    keywords: ["AWS CloudFormation", "Managed services"],
    example: "Un equipo reproduce redes y servidores mediante una plantilla.",
    confusion:
      "Elastic Beanstalk focuses on deploying applications on a managed platform workflow.",
    mnemonic: "Formation = formar infraestructura a partir de una plantilla.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-090",
    service: "AWS Systems Manager",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service helps manage fleets of nodes and automate operational tasks?",
    answer: "AWS Systems Manager",
    explanation:
      "Systems Manager centraliza tareas operativas como comandos, inventario y parches en nodos administrados.",
    keywords: ["AWS Systems Manager", "Managed services"],
    example: "Un equipo aplica parches a grupos de instancias.",
    confusion:
      "CloudWatch observes metrics and logs; Systems Manager performs operational actions.",
    mnemonic: "Systems Manager = el taller de operaciones de tus nodos.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-091",
    service: "AWS Organizations",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service centrally manages multiple AWS accounts and consolidated billing?",
    answer: "AWS Organizations",
    explanation:
      "Organizations agrupa cuentas y permite gobierno y facturación consolidada.",
    keywords: ["AWS Organizations", "Managed services"],
    example: "Una empresa separa producción y desarrollo en cuentas distintas.",
    confusion:
      "IAM primarily manages identities and permissions within an account.",
    mnemonic: "Organizations = familia de cuentas y factura consolidada.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-092",
    service: "AWS Control Tower",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service helps establish and govern a multi-account AWS landing zone?",
    answer: "AWS Control Tower",
    explanation:
      "Control Tower facilita configurar una zona de aterrizaje con controles para múltiples cuentas.",
    keywords: ["AWS Control Tower", "Managed services"],
    example:
      "Una organización crea un entorno de cuentas con gobierno inicial.",
    confusion:
      "Organizations provides account structure; Control Tower builds on multi-account capabilities for landing zones.",
    mnemonic: "Control Tower = torre de control para una zona de aterrizaje.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-093",
    service: "AWS Trusted Advisor",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service provides recommendations based on AWS best practices?",
    answer: "AWS Trusted Advisor",
    explanation:
      "Trusted Advisor ofrece comprobaciones y recomendaciones; la cobertura depende del acceso y plan aplicables.",
    keywords: ["AWS Trusted Advisor", "Managed services"],
    example: "Un equipo revisa oportunidades de optimización y seguridad.",
    confusion:
      "CloudWatch alarms evaluate selected metrics rather than a broad best-practice checklist.",
    mnemonic: "Advisor = consejero de buenas prácticas.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-094",
    service: "Amazon SQS",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service provides a queue to decouple application components?",
    answer: "Amazon SQS",
    explanation:
      "SQS almacena mensajes para que productores y consumidores trabajen de forma desacoplada.",
    keywords: ["Amazon SQS", "Managed services"],
    example: "Pedidos esperan en una cola mientras trabajadores los procesan.",
    confusion:
      "SNS pushes notifications to subscribers; SQS retains messages for consumers to retrieve.",
    mnemonic:
      "SQS: Queue = espera en una cola hasta que un consumidor te recoja.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-095",
    service: "Amazon SNS",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service sends notifications to multiple subscribers using publish/subscribe topics?",
    answer: "Amazon SNS",
    explanation: "SNS distribuye mensajes a suscriptores de un tema.",
    keywords: ["Amazon SNS", "Managed services"],
    example: "Un evento de pedido notifica a varios sistemas mediante un tema.",
    confusion:
      "SQS is a queue for pulling and processing messages rather than a topic fan-out service.",
    mnemonic: "SNS = un anuncio para muchos suscriptores.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-096",
    service: "Amazon EventBridge",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service routes events from AWS services, applications, and SaaS sources using event buses and rules?",
    answer: "Amazon EventBridge",
    explanation:
      "EventBridge enruta eventos según reglas para conectar sistemas desacoplados.",
    keywords: ["Amazon EventBridge", "Managed services"],
    example:
      "Un evento de negocio activa destinos que coinciden con su contenido.",
    confusion:
      "Step Functions orchestrates stateful workflows rather than primarily routing events.",
    mnemonic: "EventBridge = puente que enruta eventos según reglas.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-097",
    service: "AWS Step Functions",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service coordinates multi-step workflows with states and retries?",
    answer: "AWS Step Functions",
    explanation:
      "Step Functions orquesta pasos con control de flujo, manejo de errores y reintentos.",
    keywords: ["AWS Step Functions", "Managed services"],
    example: "Un pedido pasa por validación, cobro y envío.",
    confusion:
      "EventBridge routes events; it does not replace workflow state management.",
    mnemonic: "Step Functions = un flujo, paso a paso, con estado.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-098",
    service: "Amazon API Gateway",
    domain: "technology",
    category: "Services & infrastructure",
    question:
      "Which service creates and manages APIs that invoke backends such as Lambda?",
    answer: "Amazon API Gateway",
    explanation:
      "API Gateway permite publicar y administrar APIs con integraciones y controles.",
    keywords: ["Amazon API Gateway", "Managed services"],
    example: "Una app móvil llama una API que ejecuta funciones Lambda.",
    confusion:
      "An ALB distributes HTTP traffic but is not the same as a managed API publishing service.",
    mnemonic: "API Gateway = la puerta administrada hacia tus APIs.",
    difficulty: "Foundation",
    tags: ["technology", "CLF-C02"],
  },
  {
    id: "clf-099",
    service: "On-Demand Instances",
    domain: "billing",
    category: "Pricing & economics",
    question:
      "Which EC2 purchase option fits short-term workloads without a long-term commitment?",
    answer: "On-Demand Instances",
    explanation:
      "On-Demand permite pagar capacidad consumida sin comprometerse por uno o tres años.",
    keywords: ["On-Demand Instances", "Cost management"],
    example: "Un equipo ejecuta un entorno temporal con demanda imprevisible.",
    confusion: "Savings Plans require a spending commitment for a term.",
    mnemonic: "On-Demand = lo pides ahora, sin prometer años.",
    difficulty: "Foundation",
    tags: ["billing", "CLF-C02"],
  },
  {
    id: "clf-100",
    service: "Spot Instances",
    domain: "billing",
    category: "Pricing & economics",
    question:
      "Which EC2 purchase option uses spare capacity and can be interrupted by AWS?",
    answer: "Spot Instances",
    explanation:
      "Spot ofrece capacidad sobrante con descuentos y posibilidad de interrupción.",
    keywords: ["Spot Instances", "Cost management"],
    example: "Un lote de tareas tolera reinicios y usa puntos de control.",
    confusion:
      "On-Demand capacity is not reclaimed under the Spot interruption model.",
    mnemonic: "Spot = capacidad sobrante: ahorra, pero prepárate para parar.",
    difficulty: "Foundation",
    tags: ["billing", "CLF-C02"],
  },
  {
    id: "clf-101",
    service: "Savings Plans",
    domain: "billing",
    category: "Pricing & economics",
    question:
      "Which pricing model offers discounts in exchange for a consistent hourly spending commitment?",
    answer: "Savings Plans",
    explanation:
      "Savings Plans intercambia un compromiso de gasto por hora por tarifas reducidas en uso elegible.",
    keywords: ["Savings Plans", "Cost management"],
    example: "Una empresa compromete su consumo base por uno o tres años.",
    confusion:
      "Reserved Instances are tied to specific instance attributes and have different flexibility rules.",
    mnemonic: "Savings Plans = prometer gasto por hora para ahorrar.",
    difficulty: "Foundation",
    tags: ["billing", "CLF-C02"],
  },
  {
    id: "clf-102",
    service: "Compute Savings Plans",
    domain: "billing",
    category: "Pricing & economics",
    question:
      "Which Savings Plan type provides flexibility across EC2 families, Regions, and eligible Fargate and Lambda usage?",
    answer: "Compute Savings Plans",
    explanation:
      "Compute Savings Plans ofrece flexibilidad sobre cómputo elegible con un compromiso de gasto.",
    keywords: ["Compute Savings Plans", "Cost management"],
    example: "Una empresa cambia de EC2 a Fargate manteniendo uso elegible.",
    confusion:
      "EC2 Instance Savings Plans are tied to an instance family in a Region.",
    mnemonic:
      "Compute = flexibilidad entre cómputo elegible, incluso Lambda y Fargate.",
    difficulty: "Foundation",
    tags: ["billing", "CLF-C02"],
  },
  {
    id: "clf-103",
    service: "EC2 Instance Savings Plans",
    domain: "billing",
    category: "Pricing & economics",
    question:
      "Which Savings Plan type is tied to an EC2 instance family within a chosen Region?",
    answer: "EC2 Instance Savings Plans",
    explanation:
      "Este plan se aplica a una familia de instancias en una región, con flexibilidad dentro de ese alcance.",
    keywords: ["EC2 Instance Savings Plans", "Cost management"],
    example:
      "Una empresa mantiene uso estable de una familia EC2 en una región.",
    confusion:
      "Compute Savings Plans provide broader service and regional flexibility.",
    mnemonic: "EC2 Instance plan = familia + región: recuerda ese alcance.",
    difficulty: "Foundation",
    tags: ["billing", "CLF-C02"],
  },
  {
    id: "clf-104",
    service: "Reserved Instances",
    domain: "billing",
    category: "Pricing & economics",
    question:
      "Which EC2 pricing benefit provides a discount for committing to matching instance attributes for a term?",
    answer: "Reserved Instances",
    explanation:
      "Las RI ofrecen un beneficio de facturación por compromiso; las RI zonales también pueden reservar capacidad.",
    keywords: ["Reserved Instances", "Cost management"],
    example:
      "Una base estable de instancias coincide con una reserva de uno o tres años.",
    confusion:
      "A Capacity Reservation alone reserves capacity and does not inherently provide a term discount.",
    mnemonic:
      "RI = descuento por coincidencia; zonal puede añadir reserva de capacidad.",
    difficulty: "Foundation",
    tags: ["billing", "CLF-C02"],
  },
  {
    id: "clf-105",
    service: "AWS Cost Explorer",
    domain: "billing",
    category: "Pricing & economics",
    question:
      "Which tool visualizes historical AWS costs and forecasts future spending?",
    answer: "AWS Cost Explorer",
    explanation:
      "Cost Explorer ayuda a analizar costos y uso, y a obtener previsiones.",
    keywords: ["AWS Cost Explorer", "Cost management"],
    example: "Un equipo identifica qué servicio incrementó el gasto mensual.",
    confusion:
      "AWS Budgets tracks budgets and triggers alerts or configured actions.",
    mnemonic: "Explorer = explorar lo que gastaste y lo que podrías gastar.",
    difficulty: "Foundation",
    tags: ["billing", "CLF-C02"],
  },
  {
    id: "clf-106",
    service: "AWS Budgets",
    domain: "billing",
    category: "Pricing & economics",
    question:
      "Which service alerts when actual or forecast costs exceed a defined threshold?",
    answer: "AWS Budgets",
    explanation:
      "Budgets permite crear presupuestos y avisar según límites configurados.",
    keywords: ["AWS Budgets", "Cost management"],
    example:
      "Un equipo recibe una alerta cuando el gasto previsto supera su presupuesto.",
    confusion:
      "A budget alert does not automatically enforce a hard spending cap.",
    mnemonic:
      "Budgets = presupuesto y avisos; no un límite automático universal.",
    difficulty: "Foundation",
    tags: ["billing", "CLF-C02"],
  },
  {
    id: "clf-107",
    service: "AWS Pricing Calculator",
    domain: "billing",
    category: "Pricing & economics",
    question:
      "Which tool estimates the cost of a proposed AWS architecture before deployment?",
    answer: "AWS Pricing Calculator",
    explanation:
      "Pricing Calculator estima costos a partir de supuestos de configuración y uso.",
    keywords: ["AWS Pricing Calculator", "Cost management"],
    example: "Un arquitecto compara escenarios de costo antes de desplegar.",
    confusion: "Cost Explorer analyzes actual account cost and usage data.",
    mnemonic: "Calculator = calcular antes de construir.",
    difficulty: "Foundation",
    tags: ["billing", "CLF-C02"],
  },
  {
    id: "clf-108",
    service: "AWS Cost and Usage Report (CUR)",
    domain: "billing",
    category: "Pricing & economics",
    question:
      "Which report provides detailed AWS cost and usage line items for custom analysis?",
    answer: "AWS Cost and Usage Report (CUR)",
    explanation:
      "CUR entrega datos detallados para análisis de costos y consumo.",
    keywords: ["AWS Cost and Usage Report (CUR)", "Cost management"],
    example:
      "Un equipo analiza partidas de facturación en sus propias herramientas.",
    confusion:
      "Budgets is intended for monitoring budgets rather than providing detailed billing line items.",
    mnemonic: "CUR = el detalle de cada partida para analizar.",
    difficulty: "Foundation",
    tags: ["billing", "CLF-C02"],
  },
  {
    id: "clf-109",
    service: "Consolidated billing",
    domain: "billing",
    category: "Pricing & economics",
    question:
      "Which Organizations feature combines charges from multiple member accounts?",
    answer: "Consolidated billing",
    explanation:
      "La facturación consolidada reúne cargos y puede compartir ciertos beneficios según reglas aplicables.",
    keywords: ["Consolidated billing", "Cost management"],
    example:
      "Una empresa recibe una factura para sus cuentas de producción y desarrollo.",
    confusion:
      "Separate accounts still maintain resource and access isolation.",
    mnemonic: "Consolidated = muchas cuentas, una factura agrupada.",
    difficulty: "Foundation",
    tags: ["billing", "CLF-C02"],
  },
  {
    id: "clf-110",
    service: "Cost allocation tags",
    domain: "billing",
    category: "Pricing & economics",
    question:
      "Which mechanism attributes AWS spending to projects using resource metadata?",
    answer: "Cost allocation tags",
    explanation:
      "Las etiquetas de asignación de costos permiten organizar costos tras su activación correspondiente.",
    keywords: ["Cost allocation tags", "Cost management"],
    example: "Un equipo agrupa gasto por proyecto y centro de costos.",
    confusion:
      "A resource tag must be activated for cost allocation where supported; tagging alone is not a budget.",
    mnemonic: "Cost tags = etiquetas que cuentan para repartir el gasto.",
    difficulty: "Foundation",
    tags: ["billing", "CLF-C02"],
  },
  {
    id: "clf-111",
    service: "Stopping an EBS-backed instance",
    domain: "billing",
    category: "Pricing & economics",
    question:
      "Which EC2 action stops compute instance charges but may leave EBS storage charges?",
    answer: "Stopping an EBS-backed instance",
    explanation:
      "Al detener una instancia cesa el cargo de cómputo correspondiente, pero pueden continuar cargos de almacenamiento y otros recursos.",
    keywords: ["Stopping an EBS-backed instance", "Cost management"],
    example:
      "Un entorno de desarrollo se detiene fuera de horario y conserva sus volúmenes.",
    confusion:
      "Terminating an instance may delete volumes depending on their delete-on-termination settings.",
    mnemonic:
      "Stop compute ≠ stop all charges: los discos pueden seguir cobrando.",
    difficulty: "Foundation",
    tags: ["billing", "CLF-C02"],
  },
  {
    id: "clf-112",
    service: "AWS account and billing support",
    domain: "billing",
    category: "Pricing & economics",
    question:
      "Which support resource is available to all AWS customers for billing and account assistance?",
    answer: "AWS account and billing support",
    explanation:
      "Los clientes pueden obtener ayuda de cuenta y facturación; el acceso a soporte técnico depende del plan.",
    keywords: ["AWS account and billing support", "Cost management"],
    example: "Un cliente solicita ayuda con un cargo de su cuenta.",
    confusion:
      "Technical support access and response targets vary by the current support offering.",
    mnemonic:
      "Billing help = ayuda con la cuenta; soporte técnico es otra cobertura.",
    difficulty: "Foundation",
    tags: ["billing", "CLF-C02"],
  },
  {
    id: "clf-113",
    service: "Total cost of ownership (TCO)",
    domain: "billing",
    category: "Pricing & economics",
    question:
      "Which cost concept includes hardware, staffing, facilities, and ongoing operation rather than purchase price alone?",
    answer: "Total cost of ownership (TCO)",
    explanation:
      "TCO considera el costo total de operar una solución a lo largo del tiempo.",
    keywords: ["Total cost of ownership (TCO)", "Cost management"],
    example:
      "Una empresa compara operar un centro propio frente a una carga en AWS.",
    confusion:
      "A monthly service estimate is only one component of a broader TCO comparison.",
    mnemonic: "TCO = todo el costo de poseer y operar, no solo la compra.",
    difficulty: "Foundation",
    tags: ["billing", "CLF-C02"],
  },
  {
    id: "clf-114",
    service: "Outbound transfer may incur charges",
    domain: "billing",
    category: "Pricing & economics",
    question:
      "What commonly happens to AWS data-transfer pricing when data is transferred out to the internet?",
    answer: "Outbound transfer may incur charges",
    explanation:
      "La salida de datos puede generar cargos según servicio, región, destino y niveles aplicables.",
    keywords: ["Outbound transfer may incur charges", "Cost management"],
    example:
      "Un sitio considera transferencia de salida al estimar el costo de descargas.",
    confusion:
      "Do not assume all transfer between services or AZs is free; check the applicable pricing.",
    mnemonic: "Data out = revisa la tarifa de salida, no asumas gratuidad.",
    difficulty: "Applied",
    tags: ["billing", "CLF-C02"],
  },
];
