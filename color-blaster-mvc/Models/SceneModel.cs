using System.Collections.Generic;

namespace color_blaster_mvc.Models
{
    public class SceneModel
    {
        public List<string> OpeningDialogueTexts { get; set; } = new List<string>();
        public List<string> OpeningAnimationTexts { get; set; } = new List<string>();
    }
}