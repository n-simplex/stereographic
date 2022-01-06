function setup() {
  	createCanvas(1000,1000, WEBGL);
	createEasyCam();
    let phi = (1+sqrt(5))/2;
	
	dodec = [createVector(1,1,1),createVector(1,1,-1),createVector(1,-1,1), createVector(1,-1,-1),createVector(-1,1,1),createVector(-1,1,-1),createVector(-1,-1,1),createVector(-1,-1,-1), createVector(0, phi, 1/phi),createVector(0, phi, -1/phi),createVector(0, -phi, 1/phi),createVector(0, -phi, -1/phi),createVector(1/phi, 0,phi),createVector(1/phi, 0,-phi),createVector(-1/phi, 0,phi),createVector(-1/phi, 0,-phi), createVector(phi, 1/phi, 0), createVector(phi, -1/phi, 0),createVector(-phi, 1/phi, 0),createVector(-phi, -1/phi, 0)];
    for (var i = 0; i< dodec.length; i++) {
        dodec[i].mult(100/sqrt(3)); 
    }
  
    let lg = Array(20);
    for (var i = 0; i < dodec.length; i++) {
      lg[i] = [p5.Vector.sub(dodec[i],dodec[15]).magSq(), i];
    }

    edges = [[0,8], [0,12],[0,16],[1,9],[1,13], [1,16],[2,10],[2,12],[2,17],[3,11],[3,13],[3,17],[4,8],[4,14],[4,18],[5,9],[5,15],[5,18],[6,10],[6,14],[6,19],[7,11],[7,15],[7,19],[8,9],[10,11],[12,14],[18,19],[16,17],[13,15]];
    faces = [[0,12,2,17,16],[0, 8, 12, 4, 14],[1, 9, 13, 5, 15],[1, 9, 16, 0, 8],[1, 13, 16, 3, 17],[2, 10, 17, 3, 11],[2, 10, 12, 6, 14],[19, 18, 6, 4, 14],[19, 18, 7, 5, 15],[19, 6, 7, 10, 11],[15, 13, 7, 3, 11],[5, 9, 18, 4, 8]];
    circs = [[[0,12], [0,16], [2,12]],
             [[0,8],[0,12],[4,8]],
             [[1,9],[1,13],[13,15]],
             [[1,9],[1,16],[0,16]],
             [[1,13],[1,16],[16,17]],
             [[2,10],[2,17], [17,3]],
             [[2,10],[2,12],[12,14]],
             [[19,18],[19,6],[6,14]],
             [[19,18],[19,7],[18,5]],
             [[19,7],[19,6],[7,11]],
             [[15,13], [15,7],[7,11]],
             [[5,9],[5,18],[18,4]]];
}

function draw() {
    background(250);
    let locX = mouseX - height / 2;
    let locY = mouseY - width / 2;
    let rotdod = Array(20);
    let l = Array(4);
    let a = Array(2);
    let v = createVector(0,0,0);
  
    stroke(60);
    stroke("orange");
  
  	for (var i = 0; i< dodec.length; i++) {
        rotdod[i] = rotateAround(rotateAround(dodec[i], createVector(1,0,0), map(locX, -height/2, height/2, 0, 2*PI)), createVector(0,1,0), map(locY, -height/2, height/2, 0, 2*PI));
        //projdod[i] = project(rotdod[i]);
	}

    for (var i = 0; i< dodec.length; i++) {
        point(rotdod[i]);
        point(project(rotdod[i]));
	}

    for (var i = 0; i < edges.length; i++) {
      divl = divide(rotdod[edges[i][0]], rotdod[edges[i][1]], 10);
      for (var j = 0; j < 10; j++) {
        divl[j] = project(divl[j]);
      }
      
      noFill()
      beginShape();
      curveVertex(divl[0].x,divl[0].y, divl[0].z);
      for (var j = 0; j < 10; j++) {
        curveVertex(divl[j].x,divl[j].y,divl[j].z);
      }
      curveVertex(divl[9].x,divl[9].y, divl[9].z);
      endShape();
      
      line(rotdod[edges[i][0]].x,rotdod[edges[i][0]].y,rotdod[edges[i][0]].z, rotdod[edges[i][1]].x,rotdod[edges[i][1]].y,rotdod[edges[i][1]].z);
    }
    
    stroke("red");
    for (var i = 0; i < faces.length; i++) {
      l = [rotdod[faces[i][0]],rotdod[faces[i][1]],rotdod[faces[i][2]],rotdod[faces[i][3]],rotdod[faces[i][4]]];
      v = av(l);
      point(v);
      point(project(v));
      
      c = circ([project(av([rotdod[circs[i][0][0]],rotdod[circs[i][0][1]]])),  project(av([rotdod[circs[i][1][0]],rotdod[circs[i][1][1]]])), project(av([rotdod[circs[i][2][0]],rotdod[circs[i][2][1]]]))]);
      push();
      translate(c[0]);
      beginShape();
      for (var j = 0; j < 13; j++) {
        curveVertex(c[1]*cos(2*PI/10*j),0,c[1]*sin(2*PI/10*j));
      }
      endShape(CLOSE);
      pop();
    }
  
    ambientLight(120);
    pointLight(100, 100, 100, 0,-300, 0);
    ambientMaterial(255);
    fill(250);
	noStroke();
    translate(0,100,0);
    push();
	rotateX(PI/2);
    ambientMaterial(100,100,250);
	plane(2000);
	pop();
}

// does stereographic projection
function project(vect) {
  let p = createVector(0,-100,0);
  let q = p5.Vector.sub(vect, p);
  q = p5.Vector.mult(q, 200/q.y);
  return p5.Vector.add(q,p);
}

// averages a bunch of vectors
function av(fac) {
  a = createVector(0,0,0);
  for (var i = 0; i < fac.length; i++) {
    a.add(fac[i])
  }
  a.mult(1/fac.length);
  a.mult(100/a.mag());
  return a;
}

// checks if p1,p2 are adjacent in the list l
function adjacent(p1,p2,l) {
  for (var i = 0; i < l.length; i++) {
    if (arraysEqual(l[i],[p1,p2])) {
      return true;
    }
  }
  return false;
}

// helpful function in finding faces
function find(f, edge, face) {
  m = Array(4);
  j = 0
  for (var i = 0; i < edge.length; i++) {
    if (edge[i][0] == f[1] || edge[i][0] == f[2]) {
      if (edge[i][1] != f[0]) {
        m[j] = edge[i][1];
        j += 1;
      }
    }
    if (edge[i][1] == f[1] || edge[i][1] == f[2]) {
      if (edge[i][0] != f[0]) {
        m[j] = edge[i][0];
        j += 1;
      }
    }
  }
  for (var i = 0; i < 4; i++) {
    for (var j = i; j < 4; j++) {
      if (adjacent(m[i], m[j], edge)) {
        return [f[0],f[1],f[2],m[i],m[j]];
      }
    }
  }
}

// checks if two arrays are equal
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// given three points, it works out the centre and radius of the unique circle passing through them
function circ(points) {
  let M11 = new Matrix(3,3, points[0].x, points[0].z, 1, points[1].x, points[1].z, 1,points[2].x, points[2].z, 1);
  let M12 = new Matrix(3,3, points[0].x**2+points[0].z**2, points[0].z, 1, points[1].x**2+points[1].z**2, points[1].z, 1,points[2].x**2+points[2].z**2, points[2].z, 1);
  let M13 = new Matrix(3,3, points[0].x**2+points[0].z**2, points[0].x, 1, points[1].x**2+points[1].z**2, points[1].x, 1,points[2].x**2+points[2].z**2, points[2].x, 1);
  let M14 = new Matrix(3,3, points[0].x**2+points[0].z**2, points[0].x, points[0].z, points[1].x**2+points[1].z**2, points[1].x, points[1].z,points[2].x**2+points[2].z**2, points[2].x, points[2].z);
  let p = createVector(1/2*M12.determinant()/M11.determinant(), 100,-1/2*M13.determinant()/M11.determinant());
  return [p,sqrt(p.x**2+p.z**2+ M14.determinant()/M11.determinant())];
}

// divides the segment between v1,v2 into num-many points on the sphere of radius 100
function divide(v1, v2, num) {
  l = Array(num);
  l[0] = v2;
  l[num-1] = v1;
  if (num == 2) {
    return l;
  }
  for (var i = 1; i < l.length-1; ++i) {
    l[i] = p5.Vector.add(p5.Vector.mult(v1, i/(num-1)), p5.Vector.mult(v2, (num-1-i)/(num-1)));
    l[i] = p5.Vector.mult(l[i], 100/p5.Vector.mag(l[i]));
  }
  return l;
}

// Rodrigues rotation formula!
function rotateAround(vect, axis, angle) {
  axis = p5.Vector.normalize(axis);

  return p5.Vector.add(
    p5.Vector.mult(vect, cos(angle)),
    p5.Vector.add(
      p5.Vector.mult(
        p5.Vector.cross(axis, vect),
        sin(angle)
      ),
      p5.Vector.mult(
        p5.Vector.mult(
          axis,
          p5.Vector.dot(axis, vect)
        ),
        (1 - cos(angle))
      )
    )
  );
}

class Matrix {
    constructor(cols, rows, ...vals) {
        this.v = [];
        for (let i = 0; i < vals.length; i++) {
            if (!this.v[i % cols]) this.v[i % cols] = [];
            this.v[i % cols][Math.floor(i / cols)] = vals[i];
        }
    }

    determinant() {
        let res = 0;
        let factors = [];
        for (let x = 0; x < this.v.length; x++) {
            for (let y = 0; y < this.v.length; y++) {
                let xx = x + y;
                if (xx >= this.v.length) xx -= this.v.length;
                factors.push(this.v[xx][y]);
            }

            res += factors.reduce((tot, cur) => tot * cur, 1);
            //log(factors)
            factors = [];

        }

        for (let x = 0; x < this.v.length; x++) {
            for (let y = 0; y < this.v.length; y++) {
                let xx = x - y;
                if (xx < 0) xx += this.v.length;
                factors.push(this.v[xx][y]);

            }
            res -= factors.reduce((tot, cur) => tot * cur, 1);
            //log(factors)
            factors = [];

        }

        return res;
    }
}