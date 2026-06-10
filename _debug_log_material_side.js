// PARCHE TEMPORAL DE DIAGNÓSTICO
// Añadir tras la línea que define 'm = gltf.scene' para loguear el material real

console.log('🔬 Carta cargada:', filename);
m.traverse(c => {
  if (c.isMesh && c.material) {
    console.log('  Mesh material side:', c.material.side,
      '| THREE.FrontSide:', THREE.FrontSide,
      '| THREE.DoubleSide:', THREE.DoubleSide,
      '| coincide DoubleSide?:', c.material.side === THREE.DoubleSide);
    // Forzar DoubleSide para probar
    // c.material.side = THREE.DoubleSide;
    // c.material.needsUpdate = true;
  }
});
