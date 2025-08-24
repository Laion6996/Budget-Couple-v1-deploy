import React from 'react';

interface Snapshot {
  mois: string;
  revenus: number;
  charges: number;
  versementHoel: number;
  versementZelie: number;
  resteHoel: number;
  resteZelie: number;
}

interface HistoryExportProps {
  snapshots: Snapshot[];
}

/**
 * Composant pour l'export CSV et les mini-graphiques sparkline
 * Export simple + trends lisibles sans dépendances externes
 */
export const HistoryExport: React.FC<HistoryExportProps> = ({ snapshots }) => {
  
  // Fonction d'export CSV améliorée
  const exportToCSV = () => {
    if (snapshots.length === 0) return;
    
    // En-têtes CSV avec formatage clair
    const headers = [
      'Mois',
      'Revenus (€)',
      'Charges (€)',
      'Versement Hoël (€)',
      'Versement Zélie (€)',
      'Reste Hoël (€)',
      'Reste Zélie (€)',
      'Total Reste (€)'
    ];
    
    // Données CSV formatées et séparées
    const csvData = snapshots.map(snapshot => [
      `"${snapshot.mois}"`, // Guillemets pour éviter les problèmes de virgules dans les mois
      snapshot.revenus.toFixed(2), // 2 décimales pour la précision
      snapshot.charges.toFixed(2),
      snapshot.versementHoel.toFixed(2),
      snapshot.versementZelie.toFixed(2),
      snapshot.resteHoel.toFixed(2),
      snapshot.resteZelie.toFixed(2),
      (snapshot.resteHoel + snapshot.resteZelie).toFixed(2)
    ]);
    
    // Créer le contenu CSV avec séparation claire des lignes
    const csvContent = [
      headers.join(';'), // Point-virgule pour Excel français
      ...csvData.map(row => row.join(';'))
    ].join('\r\n'); // Retour à la ligne Windows pour Excel
    
    // Ajouter le BOM UTF-8 pour Excel
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;
    
    // Créer et télécharger le fichier avec le bon type MIME
    const blob = new Blob([csvWithBOM], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `budget-couple-historique-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Nettoyer la mémoire
  };
  
  // Composant Sparkline SVG pur
  const Sparkline: React.FC<{ data: number[]; color: string; height: number; width: number }> = ({ 
    data, 
    color, 
    height, 
    width 
  }) => {
    if (data.length < 2) return null;
    
    // Normaliser les données pour l'affichage
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    // Créer les points du graphique
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg width={width} height={height} className="inline-block">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
        />
        {/* Point final */}
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * height}
          r="2"
          fill={color}
        />
      </svg>
    );
  };
  
  // Préparer les données pour les sparklines
  const revenusData = snapshots.map(s => s.revenus);
  const chargesData = snapshots.map(s => s.charges);
  const resteData = snapshots.map(s => s.resteHoel + s.resteZelie);
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-4 sm:mb-0">
          📊 Historique et Tendances
        </h3>
        
        {/* Bouton d'export CSV */}
        <button
          onClick={exportToCSV}
          disabled={snapshots.length === 0}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Exporter l'historique en CSV"
        >
          <span>📥</span>
          <span>Exporter CSV</span>
        </button>
      </div>
      
               {/* Informations sur les données */}
         <div className="mb-6 p-4 bg-gray-700 rounded-lg">
           <div className="flex items-center justify-between">
             <div className="text-sm text-gray-300">
               <span className="font-medium">Données disponibles :</span> {snapshots.length} mois
             </div>
             <div className="text-xs text-gray-400">
               Format CSV optimisé pour Excel
             </div>
           </div>
         </div>

         {/* Mini-graphiques sparkline */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenus */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300">Revenus</h4>
            <span className="text-xs text-gray-400">
              {snapshots.length > 0 ? `${snapshots[snapshots.length - 1].revenus.toLocaleString()}€` : 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Sparkline 
              data={revenusData} 
              color="#10B981" 
              height={40} 
              width={120} 
            />
            <div className="text-xs text-gray-400">
              <div>Min: {Math.min(...revenusData).toLocaleString()}€</div>
              <div>Max: {Math.max(...revenusData).toLocaleString()}€</div>
            </div>
          </div>
        </div>
        
        {/* Charges */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300">Charges</h4>
            <span className="text-xs text-gray-400">
              {snapshots.length > 0 ? `${snapshots[snapshots.length - 1].charges.toLocaleString()}€` : 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Sparkline 
              data={chargesData} 
              color="#EF4444" 
              height={40} 
              width={120} 
            />
            <div className="text-xs text-gray-400">
              <div>Min: {Math.min(...chargesData).toLocaleString()}€</div>
              <div>Max: {Math.max(...chargesData).toLocaleString()}€</div>
            </div>
          </div>
        </div>
        
        {/* Reste */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300">Reste Total</h4>
            <span className="text-xs text-gray-400">
              {snapshots.length > 0 ? `${(snapshots[snapshots.length - 1].resteHoel + snapshots[snapshots.length - 1].resteZelie).toLocaleString()}€` : 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Sparkline 
              data={resteData} 
              color="#3B82F6" 
              height={40} 
              width={120} 
            />
            <div className="text-xs text-gray-400">
              <div>Min: {Math.min(...resteData).toLocaleString()}€</div>
              <div>Max: {Math.max(...resteData).toLocaleString()}€</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Statistiques rapides */}
      {snapshots.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-600">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">
                {snapshots.length}
              </div>
              <div className="text-xs text-gray-400">Mois suivis</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(snapshots.reduce((sum, s) => sum + s.revenus, 0) / snapshots.length).toLocaleString()}€
              </div>
              <div className="text-xs text-gray-400">Revenus moyens</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">
                {Math.round(snapshots.reduce((sum, s) => sum + s.charges, 0) / snapshots.length).toLocaleString()}€
              </div>
              <div className="text-xs text-gray-400">Charges moyennes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {Math.round(snapshots.reduce((sum, s) => sum + s.resteHoel + s.resteZelie, 0) / snapshots.length).toLocaleString()}€
              </div>
              <div className="text-xs text-gray-400">Reste moyen</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
