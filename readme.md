


Angular 2: Reactive Forms - Snapshot 5
===================
En esta parte veremos estos contenidos del curso de Pluralshight:

 - Dinamically duplicate input elements

----------
### 1 -  Dinamically duplicate input elements
----------
En esta parte veremos como reaccionar a los cambios que le usuario realiza en le formulario. Debemos seguir estos pasos:

![enter image description here](https://i.imgur.com/QJZKj4i.png) 

#### Define the input(s) elements to duplicate and a FormGroup
Definimos los elementos que queremos duplciar y los metemos en un grupo ya que nos aport muchos beneficios

![enter image description here](https://i.imgur.com/Go8aGTm.png)



#### Refactor
Para facilitar la creación de grupos refactorizaremos la parte de creacion
![enter image description here](https://i.imgur.com/KkCPLSi.png)

    buildTags(tag:string = ""): FormGroup{
            return this.fb.group({
                    tag: tag
            });
        }




#### Create a FormArray
Para poder iterar creamos un FormArray. El form array será el contenedor de los FormGroups. Estos se localizaran con un indice

    <div formArrayName="tags" ...

![enter image description here](https://i.imgur.com/RxqcMwi.png)

Para crearlo:

![enter image description here](https://i.imgur.com/yjuIso1.png)

    tags: this.fb.array([])

Para accerlo accesible creamos una propieda get:

    get tags(): FormArray{
        return <FormArray>this.productForm.get('tags');
    }

#### Loop through the FormArray & duplicate the imput element

Nos queda iterar con ***ngFor** el FormArray. Tenemos que asignar el formGroup al indice. Quedaria asi:

            <div formArrayName="tags" *ngFor="let tag of tags.controls; let i=index">
                <div [formGroupName]="i">
                    <div class="form-group" >
                        <label class="col-md-2 control-label" attr.for="{{ 'tag' +i }}">Tag {{ i }}</label>

                        <div class="col-md-8">
                            <input class="form-control" 
                                    id="{{ 'tag' +i }}" 
                                    type="text" 
                                    placeholder="Tag" 
                                    formControlName="tag"/>
                        </div>
                    </div>
                </div>
            </div>

----------
### 2 - Práctica
----------
El objetivo de esta practica es inplementar los controles "tags" que teniamos cuando desarrollamos el formulario basado en Test-driven.

Podemos seguir los pasos de arriba para pode iterar o clonarel **SnapShot 5** desde el primer commit:

    git clone https://github.com/tc-frontend/course_angular2_day2_snapshot5
    cd course_angular2_day2_snapshot5
    git checkout tags/init
    npm install

y hacer los pasos detallados en el historial de commits:

Si queremos ver la App en nuestro browser

    npm start

Si queremos ver la solucion final de este SnapShot:

    git checkout master
    npm install
    npm start









