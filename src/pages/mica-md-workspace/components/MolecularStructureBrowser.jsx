import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const MolecularStructureBrowser = ({ onStructureSelect, selectedStructure }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const structures = [
    {
      id: 'pdb_1abc',
      name: 'Proteína Quinasa A',
      pdbId: '1ABC',
      category: 'kinase',
      resolution: '2.1 Å',
      organism: 'Homo sapiens',
      chains: 2,
      residues: 350,
      lastModified: '2025-08-15'
    },
    {
      id: 'pdb_2def',
      name: 'Hemoglobina Humana',
      pdbId: '2DEF',
      category: 'transport',
      resolution: '1.8 Å',
      organism: 'Homo sapiens',
      chains: 4,
      residues: 574,
      lastModified: '2025-08-20'
    },
    {
      id: 'pdb_3ghi',
      name: 'Lisozima de Clara de Huevo',
      pdbId: '3GHI',
      category: 'enzyme',
      resolution: '1.5 Å',
      organism: 'Gallus gallus',
      chains: 1,
      residues: 129,
      lastModified: '2025-08-25'
    },
    {
      id: 'pdb_4jkl',
      name: 'Citocromo C Oxidasa',
      pdbId: '4JKL',
      category: 'enzyme',
      resolution: '2.3 Å',
      organism: 'Bos taurus',
      chains: 13,
      residues: 1544,
      lastModified: '2025-08-28'
    }
  ];

  const categories = [
    { value: 'all', label: 'Todas las Categorías' },
    { value: 'kinase', label: 'Quinasas' },
    { value: 'transport', label: 'Transporte' },
    { value: 'enzyme', label: 'Enzimas' }
  ];

  const filteredStructures = structures?.filter(structure => {
    const matchesSearch = structure?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         structure?.pdbId?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || structure?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Explorador de Estructuras</h3>
        
        <div className="space-y-3">
          <Input
            type="search"
            placeholder="Buscar estructuras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e?.target?.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {categories?.map(category => (
              <option key={category?.value} value={category?.value}>
                {category?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-2 h-[calc(100%-140px)] overflow-y-auto">
        <div className="space-y-2">
          {filteredStructures?.map(structure => (
            <div
              key={structure?.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedStructure?.id === structure?.id
                  ? 'border-accent bg-accent/10' :'border-border hover:border-accent/50 hover:bg-muted/50'
              }`}
              onClick={() => onStructureSelect(structure)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground text-sm">{structure?.name}</h4>
                  <p className="text-xs text-muted-foreground">PDB: {structure?.pdbId}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {structure?.resolution}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>Cadenas: {structure?.chains}</div>
                <div>Residuos: {structure?.residues}</div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground italic">
                  {structure?.organism}
                </span>
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={12} />
                  <span className="text-xs text-muted-foreground">
                    {new Date(structure.lastModified)?.toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          iconName="Upload"
          iconPosition="left"
          className="w-full"
        >
          Cargar Estructura PDB
        </Button>
      </div>
    </div>
  );
};

export default MolecularStructureBrowser;