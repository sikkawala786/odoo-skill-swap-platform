from odoo import models, fields

class SkillProfile(models.Model):
    _name = 'skill.profile'
    _description = 'Skill Profile'

    user_id = fields.Many2one('res.users', string="User", default=lambda self: self.env.user)
    name = fields.Char(string="Name", required=True)
    location = fields.Char(string="Location")
    profile_photo = fields.Binary(string="Profile Photo")

    skills_offered = fields.Text(string="Skills Offered")
    skills_wanted = fields.Text(string="Skills Wanted")
    
    availability = fields.Selection([
        ('weekends', 'Weekends'),
        ('evenings', 'Evenings'),
        ('anytime', 'Anytime'),
    ], string="Availability", default='anytime')

    is_public = fields.Boolean(string="Public Profile", default=True)
