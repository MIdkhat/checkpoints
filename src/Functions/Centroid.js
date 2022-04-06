export default function Centroid(coords) {    
    const sum = (r, a) => r.map((b, i) => (a[i] + b));
    return coords.reduce(sum).map(x => x/coords.length)
}