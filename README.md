# Sketch Motion

## **About the Project**
**Sketch Motion** is a collaborative project aimed at building an intuitive web app that allows users to:
- Draw directly on an interactive canvas.
- Upload their own artwork.
- Animate their creations with simple, engaging effects like movement, scaling, and rotations. 
- Use AI tools for animations and suggestions. 

---

## **Current Status**
This project is in its early stages of development. 

## **Tech Stack**
- **Frontend**: React.js / Node.js
- **Backend**: Python (Flask / Django)
- **Drawing and Animation Libraries**:
  - Drawing: Fabric.js or Konva.js
  - Animation: GreenSock (GSAP) or CSS animation
- **AI and Model Training**:
  - TensorFlow / PyTorch for AI-based drawing analysis and animation generation. 
  - OpenPose or YOLO for object and motion recognition. 
  - GANs like Pix2Pix for auto-animation of drawings.
- **Deployment**: TBD

---

## **Features**
### Planned:
1. **Interactive Drawing Canvas**:
   - Brush, pen, color palette, eraser tools.
   - Save drawings locally or in the cloud.

2. **Upload and Animate**:
   - Import images or scanned drawings.
   - Apply basic animations (movement, scaling, rotation).

3. **AI**:
   - Auto-Animation: Automatically generate animations for uploaded or drawn artwork using trained models. 
   - Intelligent Suggestions: Suggest animation styles or motion patterns based on user input and drawing structure.
   - Style Transfer: Allow users to apply artistic effects to their drawings and animations. 

4. **Progress Bar**:
   - Gamified steps for users to track progress: "Step 1: Draw | Step 2: Upload | Step 3: Animate

5. **User Accounts**:
   - Save work across sessions.
   - Share creations with a community. 

---

## **Roadmap**
### Phase 1: Setup and Basics
- [ ] Set up the repository structure.
- [ ] Create a React app with basic routing.
- [ ] Implement a basic canvas using Fabric.js or Konva.js
- [ ] Integrate file upload functionality. 

### Phase 2: Animation
- [ ] Research animation libraries.
- [ ] Add simple animations to uploaded and drawn content. 

### Phase 3: Model Training
- [ ] Collect datasets (e.g., [Quick, Draw!](https://quickdraw.withgoogle.com/data) dataset, publicly available drawing datasets).
- [ ] Integrate object recognition models like [YOLO](https://pytorch.org/hub/ultralytics_yolov5/) or [OpenPose](https://github.com/Hzzone/pytorch-openpose) to analyze drawings.
- Train or fine-tune models (e.g., [Pix2Pix](https://github.com/joshmurr/cci-auto-pix2pix) for auto-animation, [Neural Style Transfer](https://pytorch.org/tutorials/advanced/neural_style_tutorial.html) for artistic effects).
- Add Ai suggestions and auto-animation features.

### Phase 3: User Accounts
- [ ] Create backend endpoints for user registration and data saving.
- [ ] Link users work to their profile. 

### Phase 4: Deployment and Testing
- [ ] Deploy to a staging environment. 
- [ ] Perform testing and collect feedback.



