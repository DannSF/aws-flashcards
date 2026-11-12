import { cards } from "./cards";
export interface ChallengeOption {
  id: string;
  text: string;
  explanation: string;
}
export interface ChallengeQuestion {
  id: string;
  domain: (typeof cards)[number]["domain"];
  prompt: string;
  options: ChallengeOption[];
  correctId: string;
}
const byNumber = (n: number) =>
  cards.find((c) => c.id === `clf-${String(n).padStart(3, "0")}`)!;
// Editorial pools contain related alternatives, not arbitrary services from the library.
const pools = [
  [1, 2, 3, 4],
  [9, 10, 11, 12, 13, 14],
  [22, 23, 24, 70],
  [34, 35, 46, 47],
  [36, 37, 88, 93],
  [38, 39, 40, 41],
  [42, 43, 49, 52],
  [44, 45, 37, 36],
  [48, 30, 34, 35],
  [55, 56, 60, 62],
  [57, 58, 59, 55],
  [61, 85, 90, 88],
  [63, 64, 65, 66],
  [67, 68, 71, 63],
  [69, 70, 63, 65],
  [72, 73, 74, 75, 76],
  [79, 80, 81, 82, 83, 84, 85, 86, 87],
  [88, 89, 90, 91, 92, 93],
  [94, 95, 96, 97, 98],
  [99, 100, 101, 104],
  [102, 103, 99, 104],
  [105, 106, 107, 108, 109, 110],
];
const custom: Record<number, [string, string][]> = {
  5: [
    [
      "Multiple subnets in a single AZ",
      "Varias subredes en la misma zona siguen dependiendo de esa zona.",
    ],
    [
      "One larger instance in a single AZ",
      "Aumentar el tamaño no elimina el punto de fallo de una sola zona.",
    ],
    [
      "A single-AZ deployment with no replicas",
      "Sin componentes en otra zona, una falla de zona interrumpe la aplicación.",
    ],
  ],
  6: [
    [
      "A single subnet in one data center",
      "Una subred pertenece a una AZ; no define una región.",
    ],
    [
      "A cache location near end users",
      "Esto describe una ubicación de borde, no una región.",
    ],
    [
      "One global network shared by every account",
      "Una región es un área geográfica concreta, no toda la red global.",
    ],
  ],
  7: [
    [
      "A geographic area containing several Regions",
      "Una AZ está dentro de una región, no contiene regiones.",
    ],
    [
      "A global DNS routing policy",
      "Una política DNS decide cómo responder consultas; no es infraestructura de una AZ.",
    ],
    [
      "A cache location outside the regional workload",
      "Una ubicación de borde no equivale a una zona de disponibilidad.",
    ],
  ],
  8: [
    [
      "AWS Region",
      "Las regiones alojan cargas regionales; las ubicaciones de borde acercan contenido cacheado.",
    ],
    [
      "Availability Zone",
      "Una AZ proporciona infraestructura regional aislada, no es una caché de borde.",
    ],
    [
      "Private subnet",
      "Una subred organiza direcciones y rutas dentro de una VPC.",
    ],
  ],
  15: [
    [
      "Increasing capacity only after demand grows",
      "Esto describe escalabilidad, no continuidad durante fallos.",
    ],
    [
      "Restoring manually after a complete outage",
      "La recuperación posterior no garantiza operación continua durante el fallo.",
    ],
    [
      "Reducing resource costs each month",
      "Optimizar costos no define tolerancia a fallos.",
    ],
  ],
  16: [
    [
      "Recovery time objective (RTO)",
      "RTO limita el tiempo de restauración, no la antigüedad de los datos recuperables.",
    ],
    [
      "Mean time to detect (MTTD)",
      "MTTD mide el tiempo medio para detectar incidentes, no pérdida de datos aceptable.",
    ],
    [
      "Monthly availability percentage",
      "La disponibilidad mensual no indica cuánto historial de datos se puede perder.",
    ],
  ],
  17: [
    [
      "Recovery point objective (RPO)",
      "RPO limita la pérdida de datos medida en tiempo, no la duración de la recuperación.",
    ],
    [
      "Mean time between failures (MTBF)",
      "MTBF describe tiempo medio entre fallos, no el objetivo para restaurar el servicio.",
    ],
    [
      "Data retention period",
      "La retención indica cuánto tiempo se guardan datos, no cuánto tarda la recuperación.",
    ],
  ],
  18: [
    [
      "Pilot light",
      "Mantiene componentes esenciales activos en el entorno de recuperación.",
    ],
    ["Warm standby", "Mantiene una versión funcional reducida del entorno."],
    [
      "Multi-site active/active",
      "Opera simultáneamente en varios sitios en lugar de reconstruir todo desde copias.",
    ],
  ],
  19: [
    [
      "Refactor",
      "Rediseña la arquitectura; no conserva la aplicación con cambios mínimos.",
    ],
    [
      "Repurchase",
      "Sustituye el producto, por ejemplo por SaaS, en lugar de moverlo casi sin cambios.",
    ],
    ["Retire", "Retira la aplicación; no la migra para seguir ejecutándola."],
  ],
  20: [
    [
      "Rehost",
      "Mueve la aplicación con cambios mínimos, sin rediseño fundamental.",
    ],
    [
      "Replatform",
      "Aplica optimizaciones limitadas sin rehacer la arquitectura fundamental.",
    ],
    [
      "Retain",
      "Mantiene la aplicación donde está en lugar de rediseñarla para AWS.",
    ],
  ],
  21: [
    [
      "AWS Well-Architected Framework",
      "Evalúa cargas mediante pilares de arquitectura; no las seis perspectivas de adopción de CAF.",
    ],
    [
      "Shared Responsibility Model",
      "Distribuye responsabilidades de seguridad entre AWS y cliente.",
    ],
    [
      "AWS Pricing Calculator",
      "Estima costos; no organiza capacidades de transformación organizativa.",
    ],
  ],
  25: [
    [
      "The customer",
      "El cliente protege sus datos y configuración, pero no administra la seguridad física de los centros de AWS.",
    ],
    [
      "The application end user",
      "El usuario final no opera los centros físicos de AWS.",
    ],
    [
      "The customer’s internet provider",
      "El proveedor de internet del cliente no controla las instalaciones de AWS.",
    ],
  ],
  26: [
    [
      "AWS",
      "En EC2 el cliente administra el sistema invitado; AWS administra la infraestructura subyacente.",
    ],
    [
      "The EC2 hardware vendor",
      "El fabricante del hardware no aplica parches al sistema invitado del cliente.",
    ],
    [
      "The application’s end users",
      "Los usuarios finales no son los responsables de administrar el sistema operativo EC2.",
    ],
  ],
  27: [
    [
      "AWS automatically chooses every bucket policy",
      "AWS ofrece controles, pero el cliente debe configurar permisos de sus datos.",
    ],
    [
      "The internet service provider",
      "El proveedor de internet no decide las políticas IAM o de bucket.",
    ],
    [
      "The owner of the physical data center",
      "La seguridad de las instalaciones no sustituye las políticas de acceso del cliente.",
    ],
  ],
  28: [
    [
      "Grant AdministratorAccess to every workload",
      "Concede permisos muy amplios, contrarios al mínimo privilegio.",
    ],
    [
      "Use the root user for routine tasks",
      "La cuenta raíz no debe usarse como identidad cotidiana.",
    ],
    [
      "Share one access key across the team",
      "Compartir claves reduce trazabilidad y no limita permisos al trabajo necesario.",
    ],
  ],
  29: [
    [
      "Store an IAM user access key in source code",
      "Son credenciales permanentes expuestas al repositorio.",
    ],
    [
      "Embed root access keys in the machine image",
      "Expone credenciales de máximo privilegio y larga duración.",
    ],
    [
      "Make the S3 bucket public",
      "No autentica a la aplicación y abre acceso innecesario a los datos.",
    ],
  ],
  31: [
    [
      "A second access key",
      "Una clave adicional no constituye un segundo factor para iniciar sesión.",
    ],
    [
      "A longer session timeout",
      "Una sesión más larga no añade una prueba de identidad.",
    ],
    [
      "An additional IAM policy",
      "Una política controla permisos, no un factor de autenticación.",
    ],
  ],
  32: [
    [
      "An application IAM role",
      "Los roles se usan habitualmente para tareas autorizadas; no equivalen a la cuenta raíz.",
    ],
    [
      "A least-privilege workforce identity",
      "Es la opción adecuada para trabajo cotidiano, no la identidad reservada de máximo poder.",
    ],
    [
      "An anonymous user",
      "Un usuario anónimo no tiene las capacidades de la cuenta raíz.",
    ],
  ],
  33: [
    [
      "An allow always overrides it",
      "Una denegación explícita aplicable prevalece sobre un permiso.",
    ],
    [
      "It grants all actions not listed",
      "Una denegación no concede acciones adicionales.",
    ],
    [
      "It is ignored when a user has two policies",
      "Combinar políticas no elimina una denegación explícita aplicable.",
    ],
  ],
  49: [
    ["Network ACL", "Las ACL de red actúan en la subred y no tienen estado."],
    [
      "Service control policy (SCP)",
      "Una SCP limita permisos de cuentas; no rastrea conexiones de red.",
    ],
    [
      "Route table",
      "Una tabla de rutas decide destinos de tráfico, no es un firewall con estado.",
    ],
  ],
  50: [
    [
      "Security group",
      "Los grupos de seguridad tienen estado y se aplican a interfaces, no a toda la subred.",
    ],
    [
      "IAM identity policy",
      "Una política IAM controla acciones sobre recursos, no tráfico en el borde de una subred.",
    ],
    [
      "Route table",
      "Las rutas seleccionan caminos; no son reglas de firewall de permitir y denegar.",
    ],
  ],
  51: [
    [
      "IAM identity policy",
      "Puede conceder permisos; una SCP solo limita los disponibles.",
    ],
    [
      "Security group",
      "Controla tráfico de red, no el máximo de permisos de una cuenta.",
    ],
    [
      "AWS Budgets alert",
      "Un aviso de presupuesto no define límites de autorización IAM.",
    ],
  ],
  53: [
    [
      "Encryption at rest",
      "Protege datos almacenados, no el canal de transmisión HTTPS.",
    ],
    [
      "S3 Versioning",
      "Conserva versiones de objetos; no cifra el tráfico de red.",
    ],
    [
      "An IAM access policy",
      "Restringe quién puede acceder, pero no sustituye el cifrado del canal.",
    ],
  ],
  54: [
    [
      "S3 Versioning",
      "Ayuda a recuperar versiones, pero no bloquea permisos públicos.",
    ],
    [
      "Server-side encryption alone",
      "Cifrar los datos no impide que una identidad autorizada públicamente pueda leerlos.",
    ],
    [
      "S3 lifecycle expiration",
      "Eliminar objetos por antigüedad no evita una política de acceso pública.",
    ],
  ],
  77: [
    [
      "Offloading read traffic",
      "Una instancia standby ordinaria de Multi-AZ no sirve consultas de lectura de la aplicación.",
    ],
    [
      "Reducing every database query to zero latency",
      "Multi-AZ no elimina la latencia ni promete consultas instantáneas.",
    ],
    [
      "Replacing all database backups",
      "La alta disponibilidad no sustituye copias para recuperarse de borrados o corrupción lógica.",
    ],
  ],
  78: [
    [
      "Synchronous standby failover only",
      "Eso describe la función principal del standby Multi-AZ; las réplicas sirven lecturas.",
    ],
    [
      "Automatically converting SQL to NoSQL",
      "Una réplica de lectura no cambia el modelo de datos.",
    ],
    [
      "Eliminating the need for access control",
      "Replicar datos no elimina la necesidad de autenticación y permisos.",
    ],
  ],
  86: [
    [
      "Internet gateway",
      "Una instancia privada sin IP pública no obtiene por sí sola traducción de direcciones salientes con un internet gateway.",
    ],
    [
      "VPC peering",
      "Conecta VPCs directamente; no proporciona salida a internet por NAT.",
    ],
    [
      "Security group",
      "Filtra tráfico permitido; no traduce direcciones ni da conectividad a internet.",
    ],
  ],
  111: [
    [
      "Leaving the instance running without traffic",
      "El cómputo sigue asignado aunque no haya solicitudes.",
    ],
    [
      "Disabling inbound traffic in its security group",
      "Bloquear tráfico no detiene la facturación del cómputo de una instancia en ejecución.",
    ],
    [
      "Removing a DNS record",
      "Cambiar DNS no detiene la instancia ni sus recursos.",
    ],
  ],
  112: [
    [
      "A dedicated Technical Account Manager for every account",
      "No todas las cuentas incluyen un TAM dedicado; depende del servicio de soporte contratado.",
    ],
    [
      "Unlimited technical architecture consulting on every plan",
      "La cobertura técnica depende del plan, a diferencia de ayuda de cuenta y facturación.",
    ],
    [
      "Guaranteed instant technical responses for all customers",
      "No existe esa garantía universal; los objetivos de respuesta dependen de cobertura y severidad.",
    ],
  ],
  113: [
    [
      "Hardware purchase price only",
      "Excluye personal, instalaciones y operación: no es el costo total.",
    ],
    [
      "One month of compute charges only",
      "Una factura parcial no cubre el costo total del ciclo de vida.",
    ],
    [
      "The number of deployed servers",
      "Contar servidores no calcula sus costos directos e indirectos.",
    ],
  ],
  114: [
    [
      "All internet outbound transfer is always free",
      "La salida puede tener cargos; deben consultarse las tarifas aplicables.",
    ],
    [
      "Only inbound transfer can ever be charged",
      "No se puede excluir la salida de la estimación de costos.",
    ],
    [
      "The price is identical for every service and destination",
      "El precio depende del servicio, destino, región y niveles aplicables.",
    ],
  ],
};
const relatedAlternatives: Record<number, number[]> = {
  22: [23, 24, 70],
  23: [22, 24, 70],
  24: [22, 23, 70],
  61: [85, 90, 88],
  85: [61, 80, 87],
  87: [86, 82, 83],
  88: [36, 37, 90],
  89: [60, 90, 92],
  90: [88, 93, 89],
  91: [30, 92, 93],
  92: [91, 89, 90],
  93: [88, 37, 41],
};
export const challengeQuestions: ChallengeQuestion[] = cards.map((card) => {
  const n = Number(card.id.replace("clf-", ""));
  const related = pools.find((pool) => pool.includes(n));
  const alternatives =
    custom[n] ??
    (
      relatedAlternatives[n] ??
      related?.filter((other) => other !== n).slice(0, 3)
    )?.map((other) => {
      const candidate = byNumber(other);
      return [
        candidate.answer,
        `Esta alternativa se refiere a otra función: ${candidate.explanation}`,
      ] as [string, string];
    });
  if (!alternatives || alternatives.length !== 3)
    throw new Error(`Missing reviewed alternatives for ${card.id}`);
  const correctId = `${card.id}:correct`;
  return {
    id: card.id,
    domain: card.domain,
    prompt: card.question,
    correctId,
    options: [
      { id: correctId, text: card.answer, explanation: card.explanation },
      ...alternatives.map(([text, explanation], i) => ({
        id: `${card.id}:alternative-${i}`,
        text,
        explanation,
      })),
    ],
  };
});
